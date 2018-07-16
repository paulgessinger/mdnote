var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
md.use(require('markdown-it-katex'));
md.use(require('markdown-it-task-lists'));
md.use(require('markdown-it-highlightjs'));
//md.use(require('markdown-it-highlight'));
md.use(require('markdown-it-attrs'));
md.use(require('markdown-it-smartarrows'));


export function renderMarkdown(mdcontent) {
  try {
    const html = md.render(mdcontent);
    //console.log(html);
    return html;
  }
  catch(e) {
    console.error("Error rendering md", e);
  }
}
