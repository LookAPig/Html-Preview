(function () {
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || document.getElementById(id)) return;
    e.preventDefault();
    location.href = 'index.html#' + id;
  });
})();
