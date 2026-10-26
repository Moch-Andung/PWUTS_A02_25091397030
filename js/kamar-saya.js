// Halaman 2.b - Kamar Saya & Status Keluhan (FR-15, FR-25)
window.initKamarSaya = function () {
  // Data contoh satu penghuni (NIK sengaja tidak ditampilkan)
  var PENGHUNI = {
    nama: 'Rina Maharani',
    tgl_masuk: '2025-08-01',
    kamar: {
      nomor_kamar: 'A-05',
      tipe: 'Standar AC',
      harga_sewa: 1500000,
      fasilitas: ['Kasur', 'Lemari', 'Meja belajar', 'Kursi', 'AC', 'Kamar mandi dalam', 'WiFi', 'Jendela', 'Stop kontak']
    }
  };

  function esc(t) { return $('<div>').text(t == null ? '' : t).html(); }
  function tgl(s) {
    return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Kartu info kamar
  $('#kk-nomor').text('Kamar ' + PENGHUNI.kamar.nomor_kamar);
  $('#kk-tipe').text(PENGHUNI.kamar.tipe);
  $('#kk-nama').text(PENGHUNI.nama);
  $('#kk-masuk').text(tgl(PENGHUNI.tgl_masuk));
  $('#kk-harga').text('Rp ' + PENGHUNI.kamar.harga_sewa.toLocaleString('id-ID') + ' / bulan');
  $.each(PENGHUNI.kamar.fasilitas, function (i, f) { $('#kk-fasilitas').append($('<li>').text(f)); });

  // Tab
  function pilihTab(nama) {
    $('.tab').removeClass('aktif').attr('aria-selected', 'false');
    $('#tab-' + nama).addClass('aktif').attr('aria-selected', 'true');
    $('#panel-info').prop('hidden', nama !== 'info');
    $('#panel-keluhan').prop('hidden', nama !== 'keluhan');
  }
  $('.tab').on('click', function () { pilihTab($(this).data('tab')); });

  // Keluhan: gabungan data JSON + keluhan baru dari sessionStorage (TC-13)
  var semua = [], filter = 'Semua';

  function ambilBaru() {
    try { return JSON.parse(sessionStorage.getItem('keluhanBaru') || '[]'); } catch (e) { return []; }
  }

  function hitung() {
    var n = { Baru: 0, Diproses: 0, Selesai: 0 };
    $.each(semua, function (i, k) { n[k.status]++; });
    $('#jml-semua, #jml-total').text(semua.length);
    $('#jml-baru').text(n.Baru);
    $('#jml-diproses').text(n.Diproses);
    $('#jml-selesai').text(n.Selesai);
  }

  function render() {
    var $ul = $('#daftar-keluhan').empty();
    var tampil = $.grep(semua, function (k) { return filter === 'Semua' || k.status === filter; });
    $('#kosong').prop('hidden', tampil.length > 0);

    $.each(tampil, function (i, k) {
      var detail = '<p>' + esc(k.deskripsi) + '</p>';
      if (k.status === 'Baru') {
        detail += '<p class="tanggapan kosong-t">Belum ada tanggapan dari pemilik.</p>';
      } else {
        detail += '<p class="tanggapan"><strong>Tanggapan pemilik:</strong> ' + esc(k.tanggapan) + '</p>';
      }
      if (k.status === 'Selesai' && k.tgl_selesai) {
        detail += '<p class="bantu">Selesai pada ' + tgl(k.tgl_selesai) + '</p>';
      }
      $ul.append(
        '<li class="item">' +
          '<button type="button" class="item-kepala" aria-expanded="false">' +
            '<span class="item-judul">' + esc(k.kategori) + '<small>Dilaporkan ' + tgl(k.tgl_lapor) + '</small></span>' +
            '<span class="badge b-' + k.status.toLowerCase() + '">' + k.status + '</span>' +
          '</button>' +
          '<div class="item-detail" hidden>' + detail + '</div>' +
        '</li>'
      );
    });
  }

  $('#daftar-keluhan').on('click', '.item-kepala', function () {
    var $d = $(this).next('.item-detail');
    var buka = $d.prop('hidden');
    $d.prop('hidden', !buka);
    $(this).attr('aria-expanded', buka);
  });

  $('.chip').on('click', function () {
    filter = $(this).data('status');
    $('.chip').removeClass('aktif');
    $(this).addClass('aktif');
    render();
  });

  $.getJSON('data/keluhan.json')
    .fail(function () { semua = []; })
    .done(function (data) { semua = data; })
    .always(function () {
      semua = ambilBaru().concat(semua);
      hitung();
      render();
      if (sessionStorage.getItem('tabAwal') === 'keluhan') {
        sessionStorage.removeItem('tabAwal');
        pilihTab('keluhan');
      }
    });
};