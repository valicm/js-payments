function displayPopup(id, text, tp) {
  if (!document.getElementById(id)) {
    var div = document.createElement('div');
    div.innerText = text;
    div.setAttribute('id', id);
    div.setAttribute(
      'style',
      'display: flex; justify-content: center; position: fixed; height: 70px;right:0;color: white;padding: 0 50px;align-items: center;border-radius: 10px;font-family: Verdana;font-size: 20px;z-index:2'
    );
    div.style.backgroundColor = tp;
    if (tp === 'green') {
      div.style.top = 0;
    } else {
      div.style.bottom = 0;
    }
    var popup = document.getElementById('st-popup');
    popup.appendChild(div);
    setTimeout(function() {
      popup.removeChild(div);
    }, 3000);
  }
}
