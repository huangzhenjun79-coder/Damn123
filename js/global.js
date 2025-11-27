// 全局交互优化脚本

// 等待DOM加载完成
 document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果优化
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('py-2', 'shadow-md');
                navbar.classList.remove('py-3');
            } else {
                navbar.classList.add('py-3');
                navbar.classList.remove('py-2', 'shadow-md');
            }
        });
    }

    // 移动端菜单增强
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            // 添加过渡动画类
            mobileMenu.classList.toggle('hidden');
            
            if (mobileMenu.classList.contains('hidden')) {
                // 菜单关闭动画
                mobileMenu.classList.add('opacity-0', 'translate-y-[-20px]');
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300);
                menuBtn.innerHTML = '<i class="fa fa-bars"></i>';
            } else {
                // 菜单打开动画
                mobileMenu.style.display = 'block';
                setTimeout(() => {
                    mobileMenu.classList.remove('opacity-0', 'translate-y-[-20px]');
                }, 10);
                menuBtn.innerHTML = '<i class="fa fa-times"></i>';
            }
        });

        // 添加过渡样式
        mobileMenu.style.transition = 'all 0.3s ease';
    }

    // 平滑滚动增强
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // 如果是页面内锚点
            if (targetId !== '#' && document.querySelector(targetId)) {
                const target = document.querySelector(targetId);
                const headerOffset = 80; // 导航栏高度
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // 关闭移动端菜单
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('opacity-0', 'translate-y-[-20px]');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.style.display = 'none';
                }, 300);
                if (menuBtn) {
                    menuBtn.innerHTML = '<i class="fa fa-bars"></i>';
                }
            }
        });
    });

    // 图片懒加载
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // 回退方案：如果浏览器不支持懒加载，则加载所有图片
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // 滚动显示动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll, .hover-scale');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible && elementBottom > 0) {
                element.classList.add('animate-fade-in');
            }
        });
    };

    // 添加动画类定义
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll, .hover-scale {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        .hover-scale:hover {
            transform: scale(1.03) translateY(0);
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .animate-pulse {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);

    // 监听滚动事件
    window.addEventListener('scroll', animateOnScroll);
    // 初始加载时执行一次
    setTimeout(animateOnScroll, 100); // 小延迟确保DOM完全渲染

    // 表单提交优化
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // 表单验证
            if (!data.name?.trim()) {
                showNotification('请输入您的姓名', 'error');
                return;
            }
            
            if (!data.phone?.trim() || !/^1[3-9]\d{9}$/.test(data.phone)) {
                showNotification('请输入正确的手机号码', 'error');
                return;
            }
            
            // 显示加载状态
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 提交中...';
            
            // 模拟API请求
            setTimeout(() => {
                // 恢复按钮状态
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // 重置表单
                this.reset();
                
                // 显示成功通知
                showNotification('提交成功！我们的客服人员将尽快与您联系。', 'success');
                
                // 或者显示成功模态框
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.classList.remove('hidden');
                    
                    // 模态框动画
                    const modalContent = successModal.querySelector('.bg-white');
                    if (modalContent) {
                        modalContent.classList.add('scale-110', 'opacity-0');
                        setTimeout(() => {
                            modalContent.classList.remove('scale-110', 'opacity-0');
                            modalContent.classList.add('scale-100', 'opacity-100');
                        }, 10);
                    }
                }
            }, 1500);
        });
    }

    // 关闭模态框事件
    const closeModal = document.getElementById('closeModal');
    const successModal = document.getElementById('successModal');
    if (closeModal && successModal) {
        closeModal.addEventListener('click', () => {
            const modalContent = successModal.querySelector('.bg-white');
            if (modalContent) {
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-90', 'opacity-0');
                setTimeout(() => {
                    successModal.classList.add('hidden');
                }, 300);
            } else {
                successModal.classList.add('hidden');
            }
        });
        
        // 点击模态框外部关闭
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                const modalContent = successModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.classList.remove('scale-100', 'opacity-100');
                    modalContent.classList.add('scale-90', 'opacity-0');
                    setTimeout(() => {
                        successModal.classList.add('hidden');
                    }, 300);
                } else {
                    successModal.classList.add('hidden');
                }
            }
        });
    }

    // 通知函数
    function showNotification(message, type = 'info') {
        // 检查是否已有通知
        let notification = document.getElementById('globalNotification');
        if (notification) {
            document.body.removeChild(notification);
        }
        
        // 创建新通知
        notification = document.createElement('div');
        notification.id = 'globalNotification';
        notification.className = `fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-500 ease-in-out z-50 ${type === 'success' ? 'bg-green-50 text-green-800' : type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fa ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3 text-xl"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.remove('translate-y-20', 'opacity-0');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    // FAQ切换增强
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            
            // 添加动画样式
            if (content.classList.contains('hidden')) {
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
                content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
                content.classList.remove('hidden');
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 20 + 'px'; // 20px 作为底部内边距
                }, 10);
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus', 'rotate-45');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                setTimeout(() => {
                    content.style.maxHeight = '0';
                }, 10);
                setTimeout(() => {
                    content.classList.add('hidden');
                    icon.classList.remove('fa-minus', 'rotate-45');
                    icon.classList.add('fa-plus');
                }, 300);
            }
        });
    });

    // 数字递增动画
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2秒
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);
            
            element.textContent = currentCount;
            
            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = target;
            }
        }, frameDuration);
    };

    // 检测元素是否在视口中
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // 初始化计数器动画
    const initializeCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };

    // 初始化页面
    initializeCounters();

    // 为按钮添加波纹效果
    const buttons = document.querySelectorAll('button, a:not([href^="#"])');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 仅对可点击元素添加效果
            if (this.disabled || this.classList.contains('no-ripple')) return;
            
            // 创建波纹元素
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
            circle.classList.add('ripple');
            
            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }
            
            this.appendChild(circle);
        });
    });

    // 添加波纹样式
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* 确保按钮相对定位 */
        button, a {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);

    // 页面加载完成后的淡入效果
    document.body.classList.add('fade-in');
    const bodyFadeStyle = document.createElement('style');
    bodyFadeStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        body.fade-in {
            opacity: 1;
        }
    `;
    document.head.appendChild(bodyFadeStyle);
});