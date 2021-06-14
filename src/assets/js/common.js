//関数
const
  getDevice = function() {
    const ua = navigator.userAgent;

    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
      return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
      return 'tab';
    }else{
      return 'other';
    }
  },
  ankerClickPageMove = () => {
    //定数
    const anker    = document.querySelectorAll('a[href^="#"]:not([target="_blank"])'),
          ankerNum = anker.length,
          max      = 50,
          interval = 10;

    //アニメーション
    function easeOut(p) {
      return p * (2 - p);
    };

    //位置取得
    function getTargetTop(elm) {
      const href   = elm.getAttribute('href'),
            target = document.querySelector(href);

      if(target === null) {
        return null;
      }

      info = target.getBoundingClientRect(),
      posY = info.top + window.pageYOffset;

      return posY;
    };

    //位置情報へ移動
    function setTargetMove(elm) {
      //変数
      let progress = 0,
          goal     = 0,
          action   = null;

      //定数
      const start = window.pageYOffset,     //スタート位置
            move  = function() {
              let pos      = getTargetTop(elm), //最終位置
                  diff     = pos - start,
                  upOrDown = diff <= 0;

              progress++;
              goal = start + (diff * easeOut(progress / max));

              window.scrollTo(0, goal);

              // 目的位置に到達したらSTOP
              if ((upOrDown && pos >= goal) || (!upOrDown && goal >= pos)) {
                clearInterval(action);

                progress = null;
                goal     = null;
                action   = null;
              }
            };

      action = setInterval(move, interval);
    };

    //クリックイベントをセットする
    function setClickEvent() {
      for(let i = 0; i < ankerNum; i++) {
        const _self = anker[i];

        _self.addEventListener('click', function(e) {
          e.preventDefault();
          setTargetMove(this);
        });
      }
    };

    setClickEvent();
  };

window.onload = () => {
  //共通変数
  const html = document.querySelectorAll('html')[0];

  //デバイスを判定しclass付与
  if (getDevice() === 'other') {
    html.classList.add('is-noTouchDevice');
  } else {
    html.classList.add('is-touchDevice');
  }

  //ページTOPボタン
  ankerClickPageMove();
};
