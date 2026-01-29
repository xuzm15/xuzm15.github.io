---
title: "JavaWeb中的Annotation"
description: "JavaWeb（Spring）常用注解：请求映射与参数绑定"
pubDate: 2016-11-15T06:40:28.000Z
tags: ["Java", "Web"]
lang: zh
slug: 20161115-javaweb-annotation
---

用 Spring 做 REST 接口时，POST/PUT 经常在请求体里带 JSON。如果方法参数上不加对应注解，服务端不会把请求体绑定进去——数据其实已经到了（比如用 `request.getReader()` 能读到）。解决办法是对 JSON 使用 `@RequestBody`。本文按两条线总结：**请求映射**（`@RequestMapping`）和**参数绑定**（方法参数从哪儿来）。

---

## 1. 请求映射：@RequestMapping

`@RequestMapping` 把「URL + HTTP 方法」映射到控制器方法上，可以标在类上（作为基础路径）或方法上。

**六个属性，分三组：**

| 分组 | 属性 | 含义 |
|------|------|------|
| 1 | `value`、`method` | 请求地址（可为 URI 模板）和 HTTP 方法（GET、POST、PUT、DELETE）。 |
| 2 | `consumes`、`produces` | 接受的请求 `Content-Type`；返回类型及与 `Accept` 的匹配。 |
| 3 | `params`、`headers` | 仅当请求带有指定参数或头时，才由该方法处理。 |

**示例：value 与 method**

一个控制器可以对应多个 URL 和方法。路径里可以有变量（如 `{day}`），用 `@PathVariable` 绑定（见 §2）。

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

**consumes** — 只接受指定 `Content-Type` 的请求（例如 JSON）：

```java
@RequestMapping(value = "/pets", method = RequestMethod.POST, consumes = "application/json")
public void addPet(@RequestBody Pet pet) { /* ... */ }
```

**produces** — 仅当请求头 `Accept` 包含该类型时才处理，且响应也是该类型：

```java
@RequestMapping(value = "/pets/{id}", method = RequestMethod.GET, produces = "application/json")
@ResponseBody
public Pet getPet(@PathVariable String id) { /* ... */ }
```

**params / headers** — 限定「只有带某参数或某头」的请求才进这个方法：

```java
@RequestMapping(value = "/search", method = RequestMethod.GET, params = "q")
public String search(@RequestParam("q") String q) { /* ... */ }

@RequestMapping(value = "/internal", method = RequestMethod.GET, headers = "X-Internal=true")
public String internalOnly() { /* ... */ }
```

---

## 2. 参数绑定：参数从哪儿来？

方法参数可以从请求的不同部分绑定，按「数据来源」选注解即可。

| 来源 | 注解 | 典型用法 |
|------|------|----------|
| URI 路径段 | `@PathVariable` | 如 `/owners/{ownerId}` → 参数 `ownerId` |
| 请求头 | `@RequestHeader` | 如 `Accept-Encoding`、`Cookie` |
| Cookie | `@CookieValue` | 如 `JSESSIONID` |
| 查询串或表单字段 | `@RequestParam` | 简单类型，GET 查询或 POST 表单 |
| 请求体（JSON/XML） | `@RequestBody` | POST/PUT 的 body，由 `HttpMessageConverter` 解析 |
| Session / Model | `@SessionAttributes`、`@ModelAttribute` | 存在 session 或由 `@ModelAttribute` 方法放入 model 的值 |

**@PathVariable** — 绑定 URL 中的一段。参数名要和模板变量一致，否则用 `@PathVariable("name")` 指定。

```java
@RequestMapping("/owners/{ownerId}/pets/{petId}")
public String findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
    // ...
}
```

**@RequestHeader / @CookieValue** — 按名称绑定某个头或 Cookie。

```java
@RequestMapping("/info")
public void info(@RequestHeader("Accept-Encoding") String encoding,
                 @CookieValue(value = "JSESSIONID", required = false) String sessionId) {
    // ...
}
```

**@RequestParam** — 查询参数或表单字段，简单类型。`value` 为参数名，`required` 可设为非必填。

```java
@RequestMapping(value = "/pet", method = RequestMethod.GET)
public String editForm(@RequestParam("id") int petId, Model model) {
    Pet pet = clinic.loadPet(petId);
    model.addAttribute("pet", pet);
    return "petForm";
}
```

**@RequestBody** — 非表单编码的请求体（如 JSON、XML），由 Spring 的 `HttpMessageConverter` 解析。

```java
@RequestMapping(value = "/api/thing", method = RequestMethod.PUT)
public void update(@RequestBody Thing thing) {
    // thing 由 JSON/XML 反序列化得到
}
```

因此：`Content-Type: application/json` 时，要接收请求体就必须在对应参数上使用 `@RequestBody`，否则不会绑定。

**@SessionAttributes / @ModelAttribute** — 在控制器上用 `@SessionAttributes` 声明会用到的 session 键。`@ModelAttribute` 标在**方法**上时，会在请求映射方法之前执行，返回值放入 model；标在**参数**上时，从 model/session 或请求参数按名称绑定。

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
        // pet 来自 session、model 或请求参数
        return "redirect:/pet/" + pet.getId();
    }
}
```

---

## 3. 无注解时的默认绑定

如果参数**没有**任何绑定注解：

- **简单类型**（基本类型、包装类、`String`、`Date` 等）→ 按 **@RequestParam** 处理（来自查询或表单）。
- **复杂类型**（如 DTO）→ 按 **@ModelAttribute** 处理（按参数名从请求参数绑定字段）。

所以 `String key` 会拿到查询/表单里的 `key`；`User user` 会从请求参数里按名字填字段（如 `user.name`、`user.email`）。要接 JSON 请求体，必须用 `@RequestBody`。

---

## 4. Content-Type 小结

- **application/x-www-form-urlencoded** — HTML 表单和很多 Ajax 的默认方式；用 `@RequestParam` 或 `@ModelAttribute` 绑定。
- **multipart/form-data** — 上传文件。
- **application/json** — REST 常用；用 **@RequestBody** 绑定请求体。
- **text/xml** — XML 请求体；同样用 **@RequestBody** 和对应的消息转换器。

---

原文链接：[life.rccoder.net](http://life.rccoder.net/webpre/1197.html)。
