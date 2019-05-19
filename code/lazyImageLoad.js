    
        // 节流函数
        function throttle (fn, interval = 500) {
            let timer = null
            let firstTime = true

            return function (...args) {
                if (firstTime) {
                // 第一次加载
                fn.apply(this, args)
                return firstTime = false
                }

                if (timer) {
                // 定时器正在执行中，跳过
                return ;
                }

                timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                fn.apply(this, args)
                }, interval)
            }
        }
        //判断是否处于视口加载区
        function isElementInViewport (el) {
            const { top, height, left, width } = el.getBoundingClientRect()
            const w = window.innerWidth || document.documentElement.clientWidth
            const h = window.innerHeight || document.documentElement.clientHeight
            return (
                top <= h &&
                (top + height) >= 0 &&
                left <= w &&
                (left + width) >= 0
            )
        }

        function LazyLoad (el, options) {
            if (!(this instanceof LazyLoad)) {
                return new LazyLoad(el);
            }
            this.setting = Object.assign({}, { src: 'data-src', srcset: 'data-srcset', selector: '.lazyload' }, options);

            if (typeof el === 'string') {
                el = document.querySelectorAll(el);
            }
            this.images = Array.from(el);
            this.listener = this.loadImage();
            this.listener();
            this.initEvent();
            }

            LazyLoad.prototype = {
            loadImage () {
                return throttle(function () {
                let startIndex = 0;
                while (startIndex < this.images.length) {
                    const image = this.images[startIndex];
                    if (isElementInViewport(image)) {
                    const src = image.getAttribute(this.setting.src);
                    const srcset = image.getAttribute(this.setting.srcset)
                    if (image.tagName.toLowerCase() === 'img') {
                        if (true) {
                        image.src = src;
                        }
                        if (srcset) {
                        image.srcset = srcset;
                        }
                    } else {
                        image.style.backgroundImage = `url(${src})`;
                    }
                    this.images.splice(startIndex, 1);
                    continue
                    }
                    startIndex++;
                }
                
                if (!this.images.length) {
                    this.destroy();
                }
                }).bind(this)
            },
            initEvent () {
                window.addEventListener('scroll', this.listener, false);
            },
            destroy () {
                window.removeEventListener('scroll', this.listener, false);
                this.images = null;
                this.listener = null;
            }
        }
        // document.onscroll = LazyLoad('img',images).initEvent();