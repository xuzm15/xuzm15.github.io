---
title: "JavaWeb Annotations Summary"
description: "Common Spring/JavaWeb annotations for request mapping and parameter binding"
pubDate: 2016-11-15T06:40:28.000Z
tags: ["Java", "Web"]
lang: en
slug: 20161115-javaweb-annotation
---

Summary of common annotations in JavaWeb (Spring), especially for RESTful and parameter binding. When using POST/PUT with `application/json`, the server may not bind the body without the right annotations; use `@RequestBody` for JSON.

## @RequestMapping

Maps request URLs to controller methods. Can be on class (base path) or method.

Attributes:

*   **value, method**: URL (can be URI template) and HTTP method (GET, POST, PUT, DELETE).
*   **consumes, produces**: Content-Type accepted (e.g. `application/json`) and returned; produces only matches when request Accept contains that type.
*   **params, headers**: Require certain request params or headers for the method to handle the request.

Example: `@RequestMapping(value="/owners/{ownerId}", method=RequestMethod.GET)` with `@PathVariable String ownerId`.

## Parameter binding

*   **@PathVariable**: Binds URI template variables (e.g. `{petId}`) to method parameters.
*   **@RequestHeader, @CookieValue**: Bind header or cookie values to parameters.
*   **@RequestParam**: For query string or form data; simple types; optional `value` and `required`.
*   **@RequestBody**: For non–form-urlencoded body (e.g. `application/json`, `application/xml`). Parsed via HttpMessageConverter.
*   **@SessionAttributes, @ModelAttribute**: Bind session attributes or model; @ModelAttribute on a method runs before @RequestMapping and puts the return value in the model.

Without annotations: simple types are treated like @RequestParam; complex types like @ModelAttribute.

Content-Type: form default is `application/x-www-form-urlencoded`; file upload uses `multipart/form-data`; JSON uses `application/json`. Server decodes using the request Content-Type.

(Original detailed post in Chinese with code samples: see [zh version](/zh/blog/20161115-javaweb-annotation/).)
