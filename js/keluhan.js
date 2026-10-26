// Halaman 2.c - Form Ajukan Keluhan (FR-24, tabel keluhan)
window.initKeluhan = function () {
  var MAKS_FOTO = 2 * 1024 * 1024;
  var $f = $('#form-keluhan');
  var hariIni = new Date();
  var iso = hariIni.getFullYear() + '-' + String(hariIni.getMonth() + 1).padStart(2, '0') + '-' + String(hariIni.getDate()).padStart(2, '0');

  $('#tgl-lapor').text(hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));

  function err(nama, pesan) {
    $('#err-' + nama).text(pesan || '');
    $('#' + nama).attr('aria-invalid', pesan ? 'true' : 'false').toggleClass('salah', !!pesan);
    return !pesan;
  }

  function cekKategori() {
    return err('kategori', $('#kategori').val() ? '' : 'Pilih salah satu kategori keluhan.');
  }
  function cekDeskripsi() {
    var n = $.trim($('#deskripsi').val()).length;
    if (n === 0) return err('deskripsi', 'Deskripsi wajib diisi.');
    if (n < 10) return err('deskripsi', 'Deskripsi minimal 10 karakter. Saat ini baru ' + n + '.');
    if (n > 500) return err('deskripsi', 'Deskripsi maksimal 500 karakter.');
    return err('deskripsi', '');
  }
  function cekFoto() {
    var file = $('#foto')[0].files[0];
    if (!file) return err('foto', '');
    if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) return err('foto', 'Format foto harus JPG atau PNG.');
    if (file.size > MAKS_FOTO) return err('foto', 'Ukuran foto maksimal 2 MB.');
    return err('foto', '');
  }

  // Penghitung karakter
  $('#deskripsi').on('input', function () {
    $('#hitung').text($(this).val().length);
    if ($('#err-deskripsi').text()) cekDeskripsi();
  });
  $('#kategori').on('change', cekKategori);

  // Pratinjau foto
  $('#foto').on('change', function () {
    var $p = $('#pratinjau');
    var file = this.files[0];
    if (cekFoto() && file) {
      $p.attr('src', URL.createObjectURL(file)).prop('hidden', false);
    } else {
      $p.prop('hidden', true).removeAttr('src');
    }
  });

  // Validasi sebelum kirim
  $f.on('submit', function (e) {
    e.preventDefault();
    $('#hasil').prop('hidden', true);

    var ok = [cekKategori(), cekDeskripsi(), cekFoto()];
    if (ok.indexOf(false) !== -1) {
      $f.find('.salah').first().focus();
      return; // tidak valid: kirim dibatalkan
    }

    var file = $('#foto')[0].files[0];
    var data = {
      kategori: $('#kategori').val(),
      deskripsi: $.trim($('#deskripsi').val()),
      foto: file ? file.name : null,
      tgl_lapor: iso,
      status: 'Baru'
    };

    $('#btn-kirim').prop('disabled', true).text('Mengirim...');
    $.ajax({
      url: 'https://httpbin.org/post',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      timeout: 10000
    }).done(function () {
      var baru;
      try { baru = JSON.parse(sessionStorage.getItem('keluhanBaru') || '[]'); } catch (x) { baru = []; }
      baru.unshift({
        id: 'K-' + Date.now(), kategori: data.kategori, deskripsi: data.deskripsi,
        status: 'Baru', tanggapan: null, tgl_lapor: iso, tgl_selesai: null
      });
      sessionStorage.setItem('keluhanBaru', JSON.stringify(baru));

      $f[0].reset();
      $('#hitung').text(0);
      $('#pratinjau').prop('hidden', true).removeAttr('src');
      $('#hasil').removeClass('gagal').html(
        '<p><strong>Keluhan tercatat, status: Baru</strong></p>' +
        '<button type="button" class="tombol kedua" id="lihat">Lihat di Kamar Saya</button>'
      ).prop('hidden', false);
      $('#lihat').on('click', function () {
        sessionStorage.setItem('tabAwal', 'keluhan');
        window.pindahKe('halaman/kamar-saya.html');
      });
    }).fail(function () {
      $('#hasil').addClass('gagal').html('<p><strong>Keluhan belum terkirim.</strong> Periksa koneksi internet lalu coba lagi.</p>').prop('hidden', false);
    }).always(function () {
      $('#btn-kirim').prop('disabled', false).text('Kirim keluhan');
    });
  });
};