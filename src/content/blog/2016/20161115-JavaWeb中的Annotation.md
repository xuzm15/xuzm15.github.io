---
title: "JavaWeb中的Annotation"
description: "JavaWeb中的Annotation总结"
pubDate: 2016-11-15T06:40:28.000Z
tags: []
---

javaweb中常用的annotation。

引言：  
前段时间项目中用到了RESTful模式来开发程序，但是当用POST、PUT模式提交数据时，发现服务器端接受不到提交的数据（服务器端参数绑定没有加任何注解），查看了提交方式为application/json， 而且服务器端通过request.getReader() 打出的数据里确实存在浏览器提交的数据。为了找出原因，便对参数绑定（@RequestParam、 @RequestBody、 @RequestHeader 、 @PathVariable）进行了研究，同时也看了一下HttpMessageConverter的相关内容，在此一并总结。

简介：  
@RequestMapping

RequestMapping是一个用来处理请求地址映射的注解，可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。

RequestMapping注解有六个属性，下面我们把它分成三类进行说明。

1、 value， method；  
value： 指定请求的实际地址，指定的地址可以是URI Template 模式（后面将会说明）；

method： 指定请求的method类型， GET、POST、PUT、DELETE等；

2、 consumes，produces；  
consumes： 指定处理请求的提交内容类型（Content-Type），例如application/json, text/html;

produces: 指定返回的内容类型，仅当request请求头中的(Accept)类型中包含该指定类型才返回；

3、 params，headers；  
params： 指定 request 中必须包含某些参数值时，才让该方法处理。

headers： 指定request中必须包含某些指定的header值，才能让该方法处理请求。

示例：  
1、value / method 示例  
默认RequestMapping(“….str…”)即为value的值；

\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@Controller  
@RequestMapping(“/appointments”)  
public class AppointmentsController {

```
private AppointmentBook appointmentBook;  

@Autowired  
public AppointmentsController(AppointmentBook appointmentBook) {  
    this.appointmentBook = appointmentBook;  
}  

@RequestMapping(method = RequestMethod.GET)  
public Map<String, Appointment> get() {  
    return appointmentBook.getAppointmentsForToday();  
}  

@RequestMapping(value="/{day}", method = RequestMethod.GET)  
public Map<String, Appointment> getForDay(@PathVariable @DateTimeFormat(iso=ISO.DATE) Date day, Model model) {  
    return appointmentBook.getAppointmentsForDay(day);  
}  

@RequestMapping(value="/new", method = RequestMethod.GET)  
public AppointmentForm getNewForm() {  
    return new AppointmentForm();  
}  

@RequestMapping(method = RequestMethod.POST)  
public String add(@Valid AppointmentForm appointment, BindingResult result) {  
    if (result.hasErrors()) {  
        return "appointments/new";  
    }  
    appointmentBook.addAppointment(appointment);  
    return "redirect:/appointments";  
}  
```

}  
value的uri值为以下三类：

A） 可以指定为普通的具体值；

B) 可以指定为含有某变量的一类值(URI Template Patterns with Path Variables)；

C) 可以指定为含正则表达式的一类值( URI Template Patterns with Regular Expressions);

example B)

\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@RequestMapping(value=”/owners/{ownerId}”, method=RequestMethod.GET)  
public String findOwner(@PathVariable String ownerId, Model model) {  
Owner owner = ownerService.findOwner(ownerId);  
model.addAttribute(“owner”, owner);  
return “displayOwner”;  
}

example C)  
\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@RequestMapping(“/spring-web/{symbolicName:\[a-z-\]+}-{version:\\d.\\d.\\d}.{extension:.\[a-z\]}”)  
public void handle(@PathVariable String version, @PathVariable String extension) {  
// …  
}  
}

2 consumes、produces 示例  
consumes 的样例：  
\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@Controller  
@RequestMapping(value = “/pets”, method = RequestMethod.POST, consumes=”application/json”)  
public void addPet(@RequestBody Pet pet, Model model) {  
// implementation omitted  
}  
方法仅处理request Content-Type为“application/json”类型的请求。

produces的样例：

\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@Controller  
@RequestMapping(value = “/pets/{petId}”, method = RequestMethod.GET, produces=”application/json”)  
@ResponseBody  
public Pet getPet(@PathVariable String petId, Model model) {  
// implementation omitted  
}  
方法仅处理request请求中Accept头中包含了”application/json”的请求，同时暗示了返回的内容类型为application/json;

3 params、headers 示例  
params的样例：

\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@Controller  
@RequestMapping(“/owners/{ownerId}”)  
public class RelativePathUriTemplateController {

@RequestMapping(value = “/pets/{petId}”, method = RequestMethod.GET, params=”myParam=myValue”)  
public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {  
// implementation omitted  
}  
}  
仅处理请求中包含了名为“myParam”，值为“myValue”的请求；

headers的样例：

\[java\] view plain copy 在CODE上查看代码片派生到我的代码片  
@Controller  
@RequestMapping(“/owners/{ownerId}”)  
public class RelativePathUriTemplateController {

@RequestMapping(value = “/pets”, method = RequestMethod.GET, headers=”Referer=[http://www.ifeng.com/](http://www.ifeng.com/)“)  
public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {  
// implementation omitted  
}  
}  
仅处理request的header中包含了指定“Refer”请求头和对应值为“[http://www.ifeng.com/”的请求；](http://www.ifeng.com/”的请求；)

上面仅仅介绍了，RequestMapping指定的方法处理哪些请求，下面一篇将讲解怎样处理request提交的数据（数据绑定）和返回的数据。

引言：  
接上一篇文章，对@RequestMapping进行地址映射讲解之后，该篇主要讲解request 数据到handler method 参数数据的绑定所用到的注解和什么情形下使用；

简介：  
handler method 参数绑定常用的注解,我们根据他们处理的Request的不同内容部分分为四类：（主要讲解常用类型）

A、处理requet uri 部分（这里指uri template中variable，不含queryString部分）的注解： @PathVariable;  
B、处理request header部分的注解： @RequestHeader, @CookieValue;  
C、处理request body部分的注解：@RequestParam, @RequestBody;

D、处理attribute类型是注解： @SessionAttributes, @ModelAttribute;

1、 @PathVariable  
当使用@RequestMapping URI template 样式映射时， 即 someUrl/{paramId}, 这时的paramId可通过 @Pathvariable注解绑定它传过来的值到方法的参数上。  
示例代码：

\[java\] view plain copy  
@Controller  
@RequestMapping(“/owners/{ownerId}”)  
public class RelativePathUriTemplateController {

@RequestMapping(“/pets/{petId}”)  
public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {  
// implementation omitted  
}  
}  
上面代码把URI template 中变量 ownerId的值和petId的值，绑定到方法的参数上。若方法参数名称和需要绑定的uri template中变量名称不一致，需要在@PathVariable(“name”)指定uri template中的名称。

2、 @RequestHeader、@CookieValue  
@RequestHeader 注解，可以把Request请求header部分的值绑定到方法的参数上。

示例代码：

这是一个Request 的header部分：

\[plain\] view plain copy  
Host localhost:8080  
Accept text/html,application/xhtml+xml,application/xml;q=0.9  
Accept-Language fr,en-gb;q=0.7,en;q=0.3  
Accept-Encoding gzip,deflate  
Accept-Charset ISO-8859-1,utf-8;q=0.7,\*;q=0.7  
Keep-Alive 300

\[java\] view plain copy  
@RequestMapping(“/displayHeaderInfo.do”)  
public void displayHeaderInfo(@RequestHeader(“Accept-Encoding”) String encoding,  
@RequestHeader(“Keep-Alive”) long keepAlive) {

//…

}  
上面的代码，把request header部分的 Accept-Encoding的值，绑定到参数encoding上了， Keep-Alive header的值绑定到参数keepAlive上。

@CookieValue 可以把Request header中关于cookie的值绑定到方法的参数上。

例如有如下Cookie值：  
\[java\] view plain copy  
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84  
参数绑定的代码：  
\[java\] view plain copy  
@RequestMapping(“/displayHeaderInfo.do”)  
public void displayHeaderInfo(@CookieValue(“JSESSIONID”) String cookie) {

//…

}  
即把JSESSIONID的值绑定到参数cookie上。

3、@RequestParam, @RequestBody  
@RequestParam  
A） 常用来处理简单类型的绑定，通过Request.getParameter() 获取的String可直接转换为简单类型的情况（ String–> 简单类型的转换操作由ConversionService配置的转换器来完成）；因为使用request.getParameter()方式获取参数，所以可以处理get 方式中queryString的值，也可以处理post方式中 body data的值；  
B）用来处理Content-Type: 为 application/x-www-form-urlencoded编码的内容，提交方式GET、POST；

C) 该注解有两个属性： value、required； value用来指定要传入值的id名称，required用来指示参数是否必须绑定；  
示例代码：

\[java\] view plain copy  
@Controller  
@RequestMapping(“/pets”)  
@SessionAttributes(“pet”)  
public class EditPetForm {

```
// ...  

@RequestMapping(method = RequestMethod.GET)  
public String setupForm(@RequestParam("petId") int petId, ModelMap model) {  
    Pet pet = this.clinic.loadPet(petId);  
    model.addAttribute("pet", pet);  
    return "petForm";  
}  

// ...  
```

@RequestBody

该注解常用来处理Content-Type: 不是application/x-www-form-urlencoded编码的内容，例如application/json, application/xml等；

它是通过使用HandlerAdapter 配置的HttpMessageConverters来解析post data body，然后绑定到相应的bean上的。

因为配置有FormHttpMessageConverter，所以也可以用来处理 application/x-www-form-urlencoded的内容，处理完的结果放在一个MultiValueMap里，这种情况在某些特殊需求下使用，详情查看FormHttpMessageConverter api;

示例代码：

\[java\] view plain copy  
@RequestMapping(value = “/something”, method = RequestMethod.PUT)  
public void handle(@RequestBody String body, Writer writer) throws IOException {  
writer.write(body);  
}  
在HTTP协议中并没有规定POST请求的数据要采用编码何种方式，从某种程度上说，这种编码方式可以是自定义的，可以是任意的。

当然，这种编码是需要和服务器有一个合适的约定，这样服务器端才能正确的解码得到的数据。通常来说，服务器是根据request中的header中的Content-Type来获取传送的数据是采用何种编码方式。

就常见的语言来说，一般会内置下面几个常见编码方式的解析。

1.application/x-www-form-urlencoded  
在form表单中，默认的情况就是这种enctype属性。也就是说，如果不显式的指定form表单post数据的编码方式的话，就会是以默认的application/x-www-form-urlencoded编码方式传输数据。

在Jquery中，进行Ajax提交数据的时候默认也是这种编码方式。

1.  multipart/form-data  
    这种编码方式也是极其常见的，主要表现在利用表单来传输文件的时候。

通常是这样书写：

  
File to process:   
  
</FORM

1.  application/json  
    这种编码方式在支持上就没有前面两种强悍了，但由于通常情况下语言对Json的序列化都做的很好，我们可以自行的获取数据流，然后做decode操作就能得到一个json式的对象，极其方便的去进行数据操作。

当然语言支持不好不代表框架支持也不好，很多主流的框架也已经开始使用这种方式了。

当然，真心觉得不好用的话也可以把得到的Json数据变成一个字符串，然后用application/x-www-form-urlencoded的方式编码，后台得到后再解析为json对象

1.  text/xml  
    相比Json而言，他的出现更早，在早期的使用上也更为广泛，各种语言对他的解析也是相当不错。不过近年来的json风也让他有了很大程度上的衰落。

原文链接：[http://life.rccoder.net/webpre/1197.html](http://life.rccoder.net/webpre/1197.html)

4、@SessionAttributes, @ModelAttribute  
@SessionAttributes:

该注解用来绑定HttpSession中的attribute对象的值，便于在方法中的参数里使用。  
该注解有value、types两个属性，可以通过名字和类型指定要使用的attribute 对象；

示例代码：

\[java\] view plain copy  
@Controller  
@RequestMapping(“/editPet.do”)  
@SessionAttributes(“pet”)  
public class EditPetForm {  
// …  
}

@ModelAttribute

该注解有两个用法，一个是用于方法上，一个是用于参数上；

用于方法上时： 通常用来在处理@RequestMapping之前，为请求绑定需要从后台查询的model；

用于参数上时： 用来通过名称对应，把相应名称的值绑定到注解的参数bean上；要绑定的值来源于：

A） @SessionAttributes 启用的attribute 对象上；

B） @ModelAttribute 用于方法上时指定的model对象；

C） 上述两种情况都没有时，new一个需要绑定的bean对象，然后把request中按名称对应的方式把值绑定到bean中。

用到方法上@ModelAttribute的示例代码：

\[java\] view plain copy  
// Add one attribute  
// The return value of the method is added to the model under the name “account”  
// You can customize the name via @ModelAttribute(“myAccount”)

@ModelAttribute  
public Account addAccount(@RequestParam String number) {  
return accountManager.findAccount(number);  
}

这种方式实际的效果就是在调用@RequestMapping的方法之前，为request对象的model里put（“account”， Account）；

用在参数上的@ModelAttribute示例代码：

\[java\] view plain copy  
@RequestMapping(value=”/owners/{ownerId}/pets/{petId}/edit”, method = RequestMethod.POST)  
public String processSubmit(@ModelAttribute Pet pet) {

}  
首先查询 @SessionAttributes有无绑定的Pet对象，若没有则查询@ModelAttribute方法层面上是否绑定了Pet对象，若没有则将URI template中的值按对应的名称绑定到Pet对象的各属性上。

补充讲解：  
问题： 在不给定注解的情况下，参数是怎样绑定的？  
通过分析AnnotationMethodHandlerAdapter和RequestMappingHandlerAdapter的源代码发现，方法的参数在不给定参数的情况下：

若要绑定的对象时简单类型： 调用@RequestParam来处理的。  
若要绑定的对象时复杂类型： 调用@ModelAttribute来处理的。

这里的简单类型指Java的原始类型(boolean, int 等)、原始类型对象（Boolean, Int等）、String、Date等ConversionService里可以直接String转换成目标对象的类型；

下面贴出AnnotationMethodHandlerAdapter中绑定参数的部分源代码：

\[java\] view plain copy  
private Object\[\] resolveHandlerArguments(Method handlerMethod, Object handler,  
NativeWebRequest webRequest, ExtendedModelMap implicitModel) throws Exception {

```
    Class[] paramTypes = handlerMethod.getParameterTypes();  
    Object[] args = new Object[paramTypes.length];  

    for (int i = 0; i < args.length; i++) {  
        MethodParameter methodParam = new MethodParameter(handlerMethod, i);  
        methodParam.initParameterNameDiscovery(this.parameterNameDiscoverer);  
        GenericTypeResolver.resolveParameterType(methodParam, handler.getClass());  
        String paramName = null;  
        String headerName = null;  
        boolean requestBodyFound = false;  
        String cookieName = null;  
        String pathVarName = null;  
        String attrName = null;  
        boolean required = false;  
        String defaultValue = null;  
        boolean validate = false;  
        Object[] validationHints = null;  
        int annotationsFound = 0;  
        Annotation[] paramAnns = methodParam.getParameterAnnotations();  

        for (Annotation paramAnn : paramAnns) {  
            if (RequestParam.class.isInstance(paramAnn)) {  
                RequestParam requestParam = (RequestParam) paramAnn;  
                paramName = requestParam.value();  
                required = requestParam.required();  
                defaultValue = parseDefaultValueAttribute(requestParam.defaultValue());  
                annotationsFound++;  
            }  
            else if (RequestHeader.class.isInstance(paramAnn)) {  
                RequestHeader requestHeader = (RequestHeader) paramAnn;  
                headerName = requestHeader.value();  
                required = requestHeader.required();  
                defaultValue = parseDefaultValueAttribute(requestHeader.defaultValue());  
                annotationsFound++;  
            }  
            else if (RequestBody.class.isInstance(paramAnn)) {  
                requestBodyFound = true;  
                annotationsFound++;  
            }  
            else if (CookieValue.class.isInstance(paramAnn)) {  
                CookieValue cookieValue = (CookieValue) paramAnn;  
                cookieName = cookieValue.value();  
                required = cookieValue.required();  
                defaultValue = parseDefaultValueAttribute(cookieValue.defaultValue());  
                annotationsFound++;  
            }  
            else if (PathVariable.class.isInstance(paramAnn)) {  
                PathVariable pathVar = (PathVariable) paramAnn;  
                pathVarName = pathVar.value();  
                annotationsFound++;  
            }  
            else if (ModelAttribute.class.isInstance(paramAnn)) {  
                ModelAttribute attr = (ModelAttribute) paramAnn;  
                attrName = attr.value();  
                annotationsFound++;  
            }  
            else if (Value.class.isInstance(paramAnn)) {  
                defaultValue = ((Value) paramAnn).value();  
            }  
            else if (paramAnn.annotationType().getSimpleName().startsWith("Valid")) {  
                validate = true;  
                Object value = AnnotationUtils.getValue(paramAnn);  
                validationHints = (value instanceof Object[] ? (Object[]) value : new Object[] {value});  
            }  
        }  

        if (annotationsFound > 1) {  
            throw new IllegalStateException("Handler parameter annotations are exclusive choices - " +  
                    "do not specify more than one such annotation on the same parameter: " + handlerMethod);  
        }  

        if (annotationsFound == 0) {// 若没有发现注解  
            Object argValue = resolveCommonArgument(methodParam, webRequest);    //判断WebRquest是否可赋值给参数  
            if (argValue != WebArgumentResolver.UNRESOLVED) {  
                args[i] = argValue;  
            }  
            else if (defaultValue != null) {  
                args[i] = resolveDefaultValue(defaultValue);  
            }  
            else {  
                Class<?> paramType = methodParam.getParameterType();  
                if (Model.class.isAssignableFrom(paramType) || Map.class.isAssignableFrom(paramType)) {  
                    if (!paramType.isAssignableFrom(implicitModel.getClass())) {  
                        throw new IllegalStateException("Argument [" + paramType.getSimpleName() + "] is of type " +  
                                "Model or Map but is not assignable from the actual model. You may need to switch " +  
                                "newer MVC infrastructure classes to use this argument.");  
                    }  
                    args[i] = implicitModel;  
                }  
                else if (SessionStatus.class.isAssignableFrom(paramType)) {  
                    args[i] = this.sessionStatus;  
                }  
                else if (HttpEntity.class.isAssignableFrom(paramType)) {  
                    args[i] = resolveHttpEntityRequest(methodParam, webRequest);  
                }  
                else if (Errors.class.isAssignableFrom(paramType)) {  
                    throw new IllegalStateException("Errors/BindingResult argument declared " +  
                            "without preceding model attribute. Check your handler method signature!");  
                }  
                else if (BeanUtils.isSimpleProperty(paramType)) {// 判断是否参数类型是否是简单类型，若是在使用@RequestParam方式来处理,否则使用@ModelAttribute方式处理  
                    paramName = "";  
                }  
                else {  
                    attrName = "";  
                }  
            }  
        }  

        if (paramName != null) {  
            args[i] = resolveRequestParam(paramName, required, defaultValue, methodParam, webRequest, handler);  
        }  
        else if (headerName != null) {  
            args[i] = resolveRequestHeader(headerName, required, defaultValue, methodParam, webRequest, handler);  
        }  
        else if (requestBodyFound) {  
            args[i] = resolveRequestBody(methodParam, webRequest, handler);  
        }  
        else if (cookieName != null) {  
            args[i] = resolveCookieValue(cookieName, required, defaultValue, methodParam, webRequest, handler);  
        }  
        else if (pathVarName != null) {  
            args[i] = resolvePathVariable(pathVarName, methodParam, webRequest, handler);  
        }  
        else if (attrName != null) {  
            WebDataBinder binder =  
                    resolveModelAttribute(attrName, methodParam, implicitModel, webRequest, handler);  
            boolean assignBindingResult = (args.length > i + 1 && Errors.class.isAssignableFrom(paramTypes[i + 1]));  
            if (binder.getTarget() != null) {  
                doBind(binder, webRequest, validate, validationHints, !assignBindingResult);  
            }  
            args[i] = binder.getTarget();  
            if (assignBindingResult) {  
                args[i + 1] = binder.getBindingResult();  
                i++;  
            }  
            implicitModel.putAll(binder.getBindingResult().getModel());  
        }  
    }  

    return args;  
}  
```

RequestMappingHandlerAdapter中使用的参数绑定，代码稍微有些不同，有兴趣的同仁可以分析下，最后处理的结果都是一样的。

示例：  
\[java\] view plain copy  
@RequestMapping ({“/“, “/home”})  
public String showHomePage(String key){

```
    logger.debug("key="+key);  

    return "home";  
}  
```

这种情况下，就调用默认的@RequestParam来处理。

\[java\] view plain copy  
@RequestMapping (method = RequestMethod.POST)  
public String doRegister(User user){  
if(logger.isDebugEnabled()){  
logger.debug(“process url\[/user\], method\[post\] in “+getClass());  
logger.debug(user);  
}

```
return "user";  
```

}

这种情况下，就调用@ModelAttribute来处理。