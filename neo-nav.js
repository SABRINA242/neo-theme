// Neo Navigation Widget - 파라미터 설정 가능
// 사용법: {neoNav} $label1=(라벨명) $title1=(제목) $color1=(색상) ...

function parseNeoNavParams(content) {
    const params = {};
    const matches = content.match(/\$(\w+)=\(([^)]+)\)/g);
    if (matches) {
        matches.forEach(match => {
            const [, key, value] = match.match(/\$(\w+)=\(([^)]+)\)/);
            params[key] = value;
        });
    }
    return params;
}

function createNeoNav(element) {
    const content = element.textContent || element.innerText;
    if (!content.includes('{neoNav}')) return;
    
    const params = parseNeoNavParams(content);
    
    // 기본값 설정
    const defaults = {
        label1: '라벨1', title1: '제목1', color1: '#006400',
        label2: '라벨2', title2: '제목2', color2: '#ff8534', 
        label3: '라벨3', title3: '제목3', color3: '#ff40ff',
        label4: '라벨4', title4: '제목4', color4: '#4499ff'
    };
    
    // 파라미터와 기본값 병합
    const config = { ...defaults, ...params };
    
    // neo-nav HTML 생성
    const navHTML = `
        <style>
            .modern-nav-container {
                width: fit-content;
                padding: 20px;
                margin: 0 auto;
                position: sticky;
                top: 0;
                z-index: 1000;
                background: transparent;
            }
            .nav-wrapper {
                display: flex;
                align-items: center;
                gap: 30px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .nav-title {
                font-size: 24px;
                font-weight: bold;
                writing-mode: vertical-rl;
                text-orientation: upright;
                padding: 15px;
                color: #2d3436;
                border-radius: 15px;
                background: #e0e5ec;
                box-shadow: 8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff;
            }
            .nav-items {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding: 10px 0;
                scrollbar-width: none;
                position: relative;
            }
            .nav-items::-webkit-scrollbar { display: none; }
            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 25px 35px;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 145px;
                background: #e0e5ec;
                box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(245, 240, 255, 0.6);
                position: relative;
            }
            .nav-item:not(:first-child) { margin-left: -30px; }
            .nav-item:hover {
                transform: translateY(-10px);
                box-shadow: inset 8px 8px 16px rgba(163, 177, 198, 0.6), inset -8px -8px 16px rgba(245, 240, 255, 0.6);
            }
            .nav-tag {
                font-size: 14px;
                margin-bottom: 10px;
                font-weight: 500;
            }
            .nav-text {
                font-size: 15px;
                font-weight: 500;
                color: #2d3436;
            }
            @media (max-width: 768px) {
                .modern-nav-container {
                    width: 100% !important;
                    padding: 5px !important;
                    box-sizing: border-box !important;
                }
                .nav-wrapper { 
                    flex-direction: column; 
                    gap: 15px; 
                    width: 100% !important;
                    max-width: none !important;
                }
                .nav-title { 
                    writing-mode: horizontal-tb; 
                    text-orientation: mixed; 
                    padding: 10px !important;
                    font-size: 20px !important;
                }
                .nav-items { 
                    width: 100% !important; 
                    justify-content: flex-start; 
                    padding: 5px 0 !important;
                    gap: 10px !important;
                }
                .nav-item { 
                    min-width: 100px !important; 
                    padding: 12px 15px !important; 
                    margin-left: 0 !important;
                }
                .nav-item:not(:first-child) { margin-left: 0 !important; }
            }
            @media (max-width: 480px) {
                .modern-nav-container {
                    width: 100% !important;
                    padding: 3px !important;
                    margin: 0 !important;
                }
                .nav-wrapper { 
                    flex-direction: column; 
                    gap: 10px !important; 
                    width: 100% !important;
                }
                .nav-title { 
                    font-size: 18px !important;
                    padding: 8px !important;
                }
                .nav-items { 
                    width: 100% !important; 
                    gap: 5px !important;
                    padding: 3px 0 !important;
                }
                .nav-item { 
                    min-width: 80px !important; 
                    padding: 10px 12px !important; 
                    font-size: 14px !important;
                }
                .nav-tag { 
                    font-size: 12px !important; 
                }
                .nav-text { 
                    font-size: 13px !important; 
                }
            }
        </style>
        
        <div class="modern-nav-container">
            <div class="nav-wrapper">
                <div class="nav-title">MENU</div>
                <div class="nav-items">
                    ${[1,2,3,4].map(i => {
                        if (!config[`label${i}`]) return '';
                        return `
                            <div class="nav-item" data-label="${config[`label${i}`]}">
                                <span class="nav-tag" style="color: ${config[`color${i}`]}">#${config[`label${i}`]}</span>
                                <span class="nav-text">${config[`title${i}`]}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <!-- 모달 -->
        <div id="detailModal" class="modal" style="display:none;">
            <div class="modal-content" style="width:500px;background:#ffffff !important;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.3);overflow:hidden;border:2px solid #ddd;z-index:9999;position:absolute;">
                <div class="modal-header" style="background:#222 !important;color:#fff !important;display:flex;align-items:center;gap:12px;padding:18px;">
                    <span style="font-size:15px;font-weight:700;color:#ff9800;">📝 글 목록</span>
                    <span id="modalClose" style="margin-left:auto;font-size:22px;cursor:pointer;padding:5px;border-radius:50%;transition:background 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">&times;</span>
                </div>
                <div style="height:2px;width:100%;background:#111;margin:0 0 8px 0;"></div>
                <div id="modalList" style="max-height:400px;overflow-y:auto;padding:0 10px 10px 10px;background:#ffffff !important;"></div>
            </div>
        </div>
    `;
    
    element.innerHTML = navHTML;
    
    // 클릭 이벤트 추가
    const navItems = element.querySelectorAll('.nav-item');
    const modal = element.querySelector('#detailModal');
    const modalContent = modal.querySelector('.modal-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const label = this.dataset.label;
            fetch('/feeds/posts/default/-/' + encodeURIComponent(label) + '?alt=json')
                .then(response => response.json())
                .then(data => showDetailModal(data.feed.entry, this))
                .catch(() => alert('라벨 "' + label + '"의 글을 불러올 수 없습니다.'));
        });
    });
    
    // 모달 닫기
    const closeBtn = element.querySelector('#modalClose');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // 배경 클릭시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    function showDetailModal(entries, targetBtn) {
        const modalList = element.querySelector('#modalList');
        modalList.innerHTML = entries.map(entry => `
            <div style="display:flex;align-items:center;gap:10px;padding:18px 0;border-bottom:1px solid #eee;cursor:pointer;" onclick="window.location.href='${entry.link[entry.link.length-1].href}'">
                <img src="${entry.media$thumbnail ? entry.media$thumbnail.url : 'https://via.placeholder.com/64'}" style="width:64px;height:64px;border-radius:10px;object-fit:cover;flex-shrink:0;">
                <div style="display:flex;flex-direction:column;gap:4px;min-width:0;">
                    <span style="font-size:16px;font-weight:700;color:#222;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${entry.title.$t}</span>
                    <span style="font-size:13px;color:#666;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${entry.summary ? entry.summary.$t : ''}</span>
                </div>
            </div>
        `).join('');
        modal.style.display = 'block';
        
        // 원래대로 버튼 아래쪽에 위치
        const btnRect = targetBtn.getBoundingClientRect();
        modalContent.style.position = 'absolute';
        modalContent.style.top = (window.scrollY + btnRect.bottom + 8) + 'px';
        modalContent.style.left = (window.scrollX + btnRect.left) + 'px';
    }
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.widget-content').forEach(createNeoNav);
});

// 동적 로드를 위한 전역 함수
window.createNeoNav = createNeoNav; 