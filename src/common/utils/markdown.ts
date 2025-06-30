import { marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // 选择一个你喜欢的高亮主题

// 创建一个新的marked实例
const renderer = new marked.Renderer();

// 配置marked
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// marked.setOptions({
//   renderer: renderer,
//   gfm: true, // 启动类似Github的Markdown语法
//   pedantic: false,
//   breaks: false,
// });

/**
 * 将Markdown字符串转换为HTML字符串
 * @param markdownString 
 * @returns 
 */
export const parseMarkdown = async (markdownString: string): Promise<string> => {
  if (!markdownString) return '';
  // 将选项直接传递给 marked.parse
  return await marked.parse(markdownString, { renderer: renderer, gfm: true, pedantic: false, breaks: false });
};
