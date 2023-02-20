# The web component to display code

We @TotallyNerdyLtd maintain customer websites on various Website-Builders. From time to time we get asked how to
display code fragments on pages which weren't meant to display code normally.
Because adding code might interfere with other elements or functionality on said page, many Website-Builders manipulate
the entered code, remove whitespace, truncate and sanitize it. Which is absolutely fine and necessary! Otherwise, it
might lead to security issues.

One example is our blog post "How to add a "Go to Top" button to your Rocketspark website",
here https://www.totally-nerdy.com/blog/post/18679/how-to-add-a-go-to-top-button-to-your-rocketspark-website/. Without
our `tn-code-display` web component it wouldn't be possible to show code fragments in a nice, formatted and highlighted
way. Because all whitespace, including line breaks, would be removed by the way Rocketspark displays a blog post. Even
when added as custom HTML.

## Web components to the rescue

With a technology called "Web Components" it is possibly to add elements to a webpage which exist and operate in their
own sandbox, without being affected nor affect other elements on the same webpage.

`tn-code-display` is such a component. You can use our component fully independent of the rest of your page. Like this:

## Simple usage example

```
<script type="module" src="https://cdn.jsdelivr.net/gh/totally-nerdy/tn-code-display@1.2.0/dist/tn-code-display.min.js"></script>
<tn-code-display data-language="javascript">
    <textarea>
        const variable = 'variable';
        const function = function () {
            console.log(variable);
        }
    </textarea>
</tn-code-display>
```

Visit the docs folder for more example code or go to https://totally-nerdy.github.io/tn-code-display/ to get a live
demo.