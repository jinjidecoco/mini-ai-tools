/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-03-19 18:32:25
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-03-21 14:45:39
 * @FilePath: /mini-tools/miniprogram/utils/tailwind.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Tailwind CSS for Mini Program
const tailwindCSS = `
/* Custom utility classes - These are already defined in wxss files */
.text-primary { color: #111827; }
.text-secondary { color: #6B7280; }
.bg-primary { background-color: #3B82F6; }
.bg-secondary { background-color: #10B981; }
.bg-accent { background-color: #8B5CF6; }
.bg-page { background-color: #F9FAFB; }
.shadow-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.transition-all { transition: all 0.3s ease; }
`;

// Apply classes to elements - This is a no-op in Mini Programs as they use a different styling system
function applyTailwind() {
  console.log('Tailwind initialized for Mini Program');
  // The actual styles are applied via WXSS files
}

// Helper function to add classes to elements
function addClasses(element, classes) {
  if (!element) return;

  if (typeof element.setData === 'function') {
    // For Mini Program components
    const currentClasses = element.data.className || '';
    element.setData({
      className: currentClasses + ' ' + classes
    });
  } else if (element.classList && element.classList.add) {
    // For web-like environments
    const classArray = classes.split(' ');
    element.classList.add(...classArray);
  }
}

// Export Tailwind utility for use in miniprogram
module.exports = {
  css: tailwindCSS,
  apply: applyTailwind,
  addClasses: addClasses
};