$(function () {
  function tutupMenu() {
    $('body').removeClass('menu-buka');
    $('#btn-menu').attr('aria-expanded', 'false');
  }

  $('#btn-menu').on('click', function () {
    var buka = $('body').toggleClass('menu-buka').hasClass('menu-buka');
    $(this).attr('aria-expanded', buka);
  });
  $('#overlay').on('click', tutupMenu);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') { tutupMenu(); $('#lightbox').remove(); }
  });

  // Navigasi Ajax: isi halaman 2.b / 2.c dimuat ke #konten tanpa reload
  $('#sidebar [data-page]').on('click', function (e) {
    e.preventDefault();
    var halaman = $(this).data('page');
    var init = $(this).data('init');

    $('.menu').removeClass('aktif').removeAttr('aria-current');
    $('.menu[data-page="' + halaman + '"]').addClass('aktif').attr('aria-current', 'page');
    tutupMenu();
    window.scrollTo(0, 0);

    if (halaman === 'beranda') {
      $('#konten').prop('hidden', true).empty();
      $('#beranda').prop('hidden', false);
      return;
    }
    $('#beranda').prop('hidden', true);
    $('#konten').prop('hidden', false).html('<p class="muat">Memuat halaman...</p>')
      .load(halaman, function (respons, status) {
        if (status === 'error') {
          $(this).html('<p class="galat">Halaman gagal dimuat. Buka situs lewat Live Server atau python -m http.server, bukan lewat file://.</p>');
          return;
        }
        if (init && typeof window[init] === 'function') { window[init](); }
      });
  });

  // Dipakai halaman lain untuk berpindah menu
  window.pindahKe = function (halaman) {
    $('.menu[data-page="' + halaman + '"]').trigger('click');
  };

  // Galeri: klik foto untuk memperbesar
  $('.galeri a').on('click', function (e) {
    e.preventDefault();
    var $lb = $('<div id="lightbox" role="dialog" aria-label="Foto diperbesar"></div>');
    $('<img>').attr({ src: $(this).attr('href'), alt: $(this).data('alt') }).appendTo($lb);
    $('<button type="button">Tutup</button>').appendTo($lb);
    $lb.on('click', function () { $lb.remove(); }).appendTo('body');
  });
});