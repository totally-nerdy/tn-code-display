# The web component to display code

We @TotallyNerdyLtd maintain customer websites on various Website-Builders. From time to time we get asked how to
display code fragments on pages which weren't meant to display code normally.
Because adding code might interfere with other elements or functionality on the page, many Website-Builders manipulate
the entered code, remove whitespace, truncate and sanitize it. Which is absolutely fine and necessary! Otherwise, it
might lead to security issues.

## Web components to the rescue

With a technology called "Web Components" it is possibly to add elements to a webpage which exist and operate in their
own sandbox, without being affected nor affect other elements on the same webpage.

`tn-code-display` is such a component. You can use our component 100% independent of the rest of your page. Like this:

## Simple usage example

```
<script type="module" src="https://cdn.jsdelivr.net/gh/totally-nerdy/tn-code-display/dist/tn-code-display.min.js"></script>
<tn-code-display data-language="javascript">
    <textarea>
        const variable = 'variable';
        const function = function () {
            console.log(variable);
        }
    </textarea>
</tn-code-display>
```

Visit the example folder for more examples.