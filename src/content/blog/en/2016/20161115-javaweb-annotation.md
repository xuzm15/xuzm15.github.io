---
title: "JavaWeb Annotations Summary"
description: "Common Spring/JavaWeb annotations for request mapping and parameter binding"
pubDate: 2016-11-15T06:40:28.000Z
tags: ["Java", "Web"]
lang: en
slug: 20161115-javaweb-annotation
---

When building REST-style APIs with Spring, POST/PUT requests often send JSON in the body. If you don’t add the right annotation, the server won’t bind that body to your method parameters—even though the data is there (e.g. visible via `request.getReader()`). The fix is to use `@RequestBody` for JSON. This post summarizes **request mapping** (`@RequestMapping`) and **parameter binding** (where handler method arguments come from).

---

## 1. Request mapping: @RequestMapping

`@RequestMapping` maps a request URL and HTTP method to a controller method. It can be placed on the class (base path) or on the method.

**Six attributes in three groups:**

| Group | Attributes | Meaning |
|-------|------------|--------|
| 1 | `value`, `method` | URL (or URI template) and HTTP method (GET, POST, PUT, DELETE). |
| 2 | `consumes`, `produces` | Request `Content-Type` accepted; response type and `Accept` matching. |
| 3 | `params`, `headers` | Only handle the request if it has certain parameters or headers. |

**Example: value and method**

One controller can serve several URLs and methods. Path segments can be variables (e.g. `{day}`) and bound with `@PathVariable` (see §2).

```java
@Controller
@RequestMapping("/appointments")
public class AppointmentsController {

    @RequestMapping(method = RequestMethod.GET)
    public Map<String, Appointment> get() {
        return appointmentBook.getAppointmentsForToday();
    }

    @RequestMapping(value = "/{day}", method = RequestMethod.GET)
    public Map<String, Appointment> getForDay(@PathVariable @DateTimeFormat(iso = ISO.DATE) Date day, Model model) {
        return appointmentBook.getAppointmentsForDay(day);
    }

    @RequestMapping(method = RequestMethod.POST)
    public String add(@Valid AppointmentForm appointment, BindingResult result) {
        if (result.hasErrors()) return "appointments/new";
        appointmentBook.addAppointment(appointment);
        return "redirect:/appointments";
    }
}
```

**consumes** — Only accept requests with a given `Content-Type` (e.g. JSON):

```java
@RequestMapping(value = "/pets", method = RequestMethod.POST, consumes = "application/json")
public void addPet(@RequestBody Pet pet) { /* ... */ }
```

**produces** — Only handle when `Accept` includes that type; response is that type:

```java
@RequestMapping(value = "/pets/{id}", method = RequestMethod.GET, produces = "application/json")
@ResponseBody
public Pet getPet(@PathVariable String id) { /* ... */ }
```

**params / headers** — Narrow which requests hit this method:

```java
@RequestMapping(value = "/search", method = RequestMethod.GET, params = "q")
public String search(@RequestParam("q") String q) { /* ... */ }

@RequestMapping(value = "/internal", method = RequestMethod.GET, headers = "X-Internal=true")
public String internalOnly() { /* ... */ }
```

---

## 2. Parameter binding: where do arguments come from?

Handler method parameters are bound from different parts of the request. Use the right annotation for each source.

| Source | Annotation | Use case |
|--------|------------|----------|
| URI path segment | `@PathVariable` | e.g. `/owners/{ownerId}` → `String ownerId` |
| Request header | `@RequestHeader` | e.g. `Accept-Encoding`, `Cookie` |
| Cookie | `@CookieValue` | e.g. `JSESSIONID` |
| Query string or form field | `@RequestParam` | Simple types, GET query or POST form |
| Request body (JSON/XML) | `@RequestBody` | POST/PUT body, parsed by `HttpMessageConverter` |
| Session / model | `@SessionAttributes`, `@ModelAttribute` | Values stored in session or added by `@ModelAttribute` methods |

**@PathVariable** — Binds a segment in the URL. Parameter name must match the template variable, or use `@PathVariable("name")`.

```java
@RequestMapping("/owners/{ownerId}/pets/{petId}")
public String findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
    // ...
}
```

**@RequestHeader / @CookieValue** — Bind a header or cookie by name.

```java
@RequestMapping("/info")
public void info(@RequestHeader("Accept-Encoding") String encoding,
                 @CookieValue(value = "JSESSIONID", required = false) String sessionId) {
    // ...
}
```

**@RequestParam** — Query or form field, simple type. Use `value` for the parameter name, `required` to make it optional.

```java
@RequestMapping(value = "/pet", method = RequestMethod.GET)
public String editForm(@RequestParam("id") int petId, Model model) {
    Pet pet = clinic.loadPet(petId);
    model.addAttribute("pet", pet);
    return "petForm";
}
```

**@RequestBody** — Request body that is not form-encoded (e.g. JSON, XML). Spring uses `HttpMessageConverter` to parse it.

```java
@RequestMapping(value = "/api/thing", method = RequestMethod.PUT)
public void update(@RequestBody Thing thing) {
    // thing is deserialized from JSON/XML
}
```

So: for `Content-Type: application/json`, you need `@RequestBody` on the parameter that should receive the body. Without it, the body is not bound.

**@SessionAttributes / @ModelAttribute** — `@SessionAttributes` on the controller declares which session keys are used. `@ModelAttribute` on a **method** runs before request mapping and puts its return value into the model; on a **parameter** it binds from model/session or from the request.

```java
@Controller
@SessionAttributes("pet")
public class EditPetController {

    @ModelAttribute
    public Account loadAccount(@RequestParam("accountId") String id) {
        return accountService.find(id);
    }

    @RequestMapping(value = "/pet/{id}/edit", method = RequestMethod.POST)
    public String save(@ModelAttribute Pet pet) {
        // pet from session, model, or request
        return "redirect:/pet/" + pet.getId();
    }
}
```

---

## 3. Default binding (no annotation)

If a parameter has **no** binding annotation:

- **Simple type** (primitive, wrapper, `String`, `Date`, etc.) → bound as **@RequestParam** (from query or form).
- **Complex type** (e.g. a DTO) → bound as **@ModelAttribute** (from request parameters by name).

So `String key` gets the query/form parameter `key`; `User user` gets its fields from request parameters (e.g. `user.name`, `user.email`). For a JSON body you must use `@RequestBody`.

---

## 4. Content-Type in short

- **application/x-www-form-urlencoded** — Default for HTML forms and many Ajax calls; parameters are bound with `@RequestParam` or `@ModelAttribute`.
- **multipart/form-data** — File uploads.
- **application/json** — REST APIs; use **@RequestBody** to bind the body.
- **text/xml** — XML body; also use **@RequestBody** and the appropriate message converter.

---

Reference: [life.rccoder.net](http://life.rccoder.net/webpre/1197.html) (original Chinese).
