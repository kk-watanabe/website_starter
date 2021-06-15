import { getDevice } from "./utils"

window.onload = () => {
  //共通変数
  const html = document.querySelectorAll("html")[0];

  //デバイスを判定しclass付与
  if (getDevice() === "other") {
    html.classList.add("is-noTouchDevice");
  } else {
    html.classList.add("is-touchDevice");
  }

  //ページTOPボタン
  // ankerClickPageMove();
};
