/**
 * Neo Theme - Table of Contents 자동 생성
 * GitHub: https://github.com/SABRINA242/neo-theme
 * CDN: https://cdn.jsdelivr.net/gh/SABRINA242/neo-theme@refs/heads/main/table-of-contents.js
 */

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 개별 포스트 페이지에서만 실행
    if (window.location.pathname.includes('/p/') || document.body.classList.contains('item-view')) {
        generateTableOfContents();
    }
});

function generateTableOfContents() {
    const postContent = document.querySelector('.post-body') || document.querySelector('article') || document.querySelector('.entry-content');
    if (!postContent) return;
    
    const headings = postContent.querySelectorAll('h2');
    if (headings.length === 0) return;
    
    // 첫 번째 h2 찾기
    const firstH2 = postContent.querySelector('h2');
    if (!firstH2) return;
    
    // 각 헤딩에 ID 추가
    let tocItems = '';
    headings.forEach((heading, index) => {
        const id = 'heading-' + index;
        heading.id = id;
        const text = heading.textContent.trim();
        tocItems += `<li style="border-bottom: 1px solid #f1f3f5;">
            <a href="#${id}" style="color: #495057; text-decoration: none; font-size: 15px; line-height: 1.5; display: block; padding: 15px 25px; transition: all 0.2s ease;">
                <span style="margin-right: 8px; color: #6c757d;">•</span>${text}
            </a>
        </li>`;
    });
    
    // 목차 HTML 생성
    const tocHTML = `
        <div id="toc-container" style="background: #ffffff; border: 2px solid #e8ecf0; border-radius: 15px; margin: 30px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
            <div onclick="toggleTOC()" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 18px 25px; cursor: pointer; border-bottom: 1px solid #e8ecf0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #2c3e50; font-size: 18px; font-weight: 600;">
                    <span style="margin-right: 10px; font-size: 20px;">📋</span>목차
                </h3>
                <span id="toc-icon" style="color: #6c757d; font-size: 14px; font-weight: bold;">▼</span>
            </div>
            <ul id="toc-list" style="margin: 0; padding: 0; list-style: none; max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                ${tocItems}
            </ul>
        </div>
    `;
    
    // 목차 삽입
    firstH2.insertAdjacentHTML('beforebegin', tocHTML);
    
    // 전역 함수 등록
    window.toggleTOC = function() {
        const content = document.getElementById('toc-list');
        const icon = document.getElementById('toc-icon');
        
        if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.textContent = '▲';
        } else {
            content.style.maxHeight = '0px';
            icon.textContent = '▼';
        }
    };
    
    // 링크 호버 효과 추가
    setTimeout(function() {
        const tocLinks = document.querySelectorAll('#toc-list a');
        tocLinks.forEach(link => {
            link.addEventListener('mouseover', function() {
                this.style.background = '#f8f9fa';
                this.style.color = '#2c3e50';
                this.style.paddingLeft = '35px';
            });
            
            link.addEventListener('mouseout', function() {
                this.style.background = 'transparent';
                this.style.color = '#495057';
                this.style.paddingLeft = '25px';
            });
            
            link.addEventListener('click', function() {
                setTimeout(function() {
                    const content = document.getElementById('toc-list');
                    const icon = document.getElementById('toc-icon');
                    if (content) {
                        content.style.maxHeight = '0px';
                        icon.textContent = '▼';
                    }
                }, 300);
            });
        });
    }, 100);
} 