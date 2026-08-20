/* ==========================================================================
   FDS 2.0 - FRAUD DETECTION SYSTEM (NashTa × JendelaTax)
   COMPREHENSIVE DUMMY DATASET & FULL APPLICATION FLOW CONTROLLER
   ========================================================================== */

// --- GLOBAL APPLICATION STATE & DUMMY DATA ---
const state = {
  currentView: 'financial',
  currentSubView: {
    financial: 'overview',
    procurement: 'dashboard',
    tax: 'equalization',
    approvals: 'toxic',
    operational: 'pos'
  },
  
  // 1. UEBA & Financial Behavioral Data
  uebaOutliers: [
    {
      id: 'USR-AP-088',
      name: 'Rudi Hartono',
      role: 'Staff Accounts Payable',
      anomaly: 'Off-Hours Journal (23:45 WIB) & Pre-Payment Master Edit',
      time: '30 Mei 2026, 23:45',
      amount: 'Rp 250.000.000',
      score: 94,
      action: 'Hold Payment & Lock Account'
    },
    {
      id: 'USR-PR-042',
      name: 'Siti Wahyuni',
      role: 'Buyer Pengadaan Logistik',
      anomaly: 'Near-Threshold Split PO Creation (3x @ Rp 95M)',
      time: '29 Mei 2026, 17:15',
      amount: 'Rp 285.000.000',
      score: 88,
      action: 'Consolidate PO for Board Approval'
    },
    {
      id: 'USR-AC-019',
      name: 'Bambang Irawan',
      role: 'Accounting Supervisor',
      anomaly: 'Round Amount Adjustments Without Memo',
      time: '29 Mei 2026, 22:10',
      amount: 'Rp 500.000.000',
      score: 85,
      action: 'Request Audit Justification'
    },
    {
      id: 'USR-MG-004',
      name: 'Hendra Wijaya',
      role: 'Manager Operasional',
      anomaly: 'Rubber-Stamping Approval (Avg 2.4s per Rp 200M Invoice)',
      time: '28 Mei 2026, 16:30',
      amount: 'Rp 1.450.000.000',
      score: 82,
      action: 'Peer-Review Mandatory'
    },
    {
      id: 'USR-GL-011',
      name: 'Agus Pratama',
      role: 'Junior GL Accountant',
      anomaly: 'Backdated Journal Entry (> 45 Hari Masa Lalu)',
      time: '28 Mei 2026, 02:15',
      amount: 'Rp 175.000.000',
      score: 80,
      action: 'Audit Re-Open Period Log'
    }
  ],

  userProfiling: [
    {
      name: 'Rudi Hartono (Staff AP)',
      dept: 'Keuangan & AP',
      baseline: '08:30 - 17:00 (Avg 12 Trx/Day, Nilai Max Rp 40M)',
      recent: 'Aktif 23:45 WIB, Input Nilai Rp 250M, Edit Rekening Vendor',
      drift: '+3.8σ Deviation (High Outlier)',
      status: 'High Risk'
    },
    {
      name: 'Siti Wahyuni (Buyer)',
      dept: 'Procurement',
      baseline: '08:00 - 16:30 (Avg 4 PO/Day, Nilai Max Rp 150M)',
      recent: 'Input 3 PO berurutan dalam 10 menit ke vendor baru',
      drift: '+2.9σ Deviation (PO Splitting)',
      status: 'High Risk'
    },
    {
      name: 'Bambang Irawan (Supervisor)',
      dept: 'Akuntansi & GL',
      baseline: '09:00 - 17:30 (Avg 8 Jurnal/Day)',
      recent: 'Posting jurnal bulat Rp 500 Juta akhir bulan di luar kantor',
      drift: '+2.4σ Deviation (Round Amount)',
      status: 'Medium Risk'
    },
    {
      name: 'Dina Lestari (Kasir)',
      dept: 'Retail Bandung Dago',
      baseline: 'Shift Pagi/Siang (Avg Void 0.8% dari total omset)',
      recent: 'Void Ratio 6.4% pasca-pelanggan meninggalkan kasir',
      drift: '+4.1σ Deviation (Skimming Flag)',
      status: 'High Risk'
    },
    {
      name: 'Hendra Wijaya (Manager)',
      dept: 'Operasional Wilayah',
      baseline: 'Review 5-8 menit per dokumen pengadaan',
      recent: 'Batch approval 35 PO dalam 2 menit tanpa buka lampiran',
      drift: '+3.2σ Deviation (Rubber Stamping)',
      status: 'Medium Risk'
    }
  ],

  offhoursJournals: [
    {
      jrnNo: 'JV-2026-00981',
      date: '30 Mei 2026, 23:45 WIB (Off-Hours)',
      user: 'Rudi Hartono (Staff AP)',
      accounts: 'Dr. Beban Konsultasi / Cr. Kas Bank Mandiri',
      amount: 'Rp 250.000.000',
      anomaly: 'Posting Tengah Malam Tanpa Dokumen Memo BAP',
      status: 'Blocked'
    },
    {
      jrnNo: 'JV-2026-00974',
      date: '29 Mei 2026, 22:10 WIB (Off-Hours)',
      user: 'Bambang Irawan (Supervisor GL)',
      accounts: 'Dr. Beban Operasional Lain / Cr. Kas Kecil',
      amount: 'Rp 500.000.000 (Round Amount)',
      anomaly: 'Angka Bulat Sempurna Tanpa Rincian Lampiran',
      status: 'Under Review'
    },
    {
      jrnNo: 'JV-2026-00955',
      date: '28 Mei 2026, 02:15 WIB (Off-Hours)',
      user: 'Agus Pratama (Junior GL)',
      accounts: 'Dr. Persediaan / Cr. Hutang Usaha Vendor Cangkang',
      amount: 'Rp 175.000.000',
      anomaly: 'Backdated Entry Mundur 45 Hari ke Periode Tertutup',
      status: 'Audit Hold'
    }
  ],

  velocityDrifts: [
    {
      user: 'Hendra Wijaya (Manager Operasional)',
      role: 'PO & AP Approver',
      totalAppr: '35 Dokumen PO',
      timeSpent: '2 Menit 14 Detik (Avg 3.8 detik/dokumen)',
      value: 'Rp 1.450.000.000',
      flag: 'Rubber-Stamping / Batch Approval Tanpa Baca Berkas',
      score: 88
    },
    {
      user: 'Budi Prakoso (Supervisor Cabang Surabaya)',
      role: 'Invoice Approver',
      totalAppr: '18 Tagihan AP',
      timeSpent: '1 Menit 40 Detik (Avg 5.5 detik/tagihan)',
      value: 'Rp 620.000.000',
      flag: 'Bypass Prosedur Verifikasi Dokumen 3-Way Matching',
      score: 82
    }
  ],

  prePaymentEdits: [
    {
      user: 'Rudi Hartono (Staff AP)',
      vendor: 'PT Maju Bersama (VEND-0098)',
      field: 'Nomor Rekening Bank Tujuan',
      before: 'Bank BCA: 012-345-6789 (Rek Resmi Vendor)',
      after: 'Bank Mandiri: 137-00-998811-2 (a.n Rudi H.)',
      timeDelta: '10 Menit Sebelum Transaksi Transfer Dijalankan',
      status: 'CRITICAL ALERT (Interception Flag)'
    },
    {
      user: 'Siti Wahyuni (Buyer)',
      vendor: 'CV Berkah Sentosa (VEND-0044)',
      field: 'Alamat Domisili & NPWP Rekanan',
      before: 'Jl. Rungkut Industri No. 12 Surabaya',
      after: 'Jl. Melati No. 8 (Alamat Rumah Pribadi Staf)',
      timeDelta: '2 Jam Sebelum Penerbitan SPK Pengadaan',
      status: 'HIGH CONFLICT ALERT'
    }
  ],

  coaIntegrity: [
    {
      account: '1109-001 (Clearing Account Bank AP)',
      balance: 'Rp 1.250.000.000 (Gantung > 60 Hari)',
      desc: 'Penumpukan mutasi transfer keluar yang belum direkonsil ke invoice sah',
      health: 'Unhealthy (Score 45%)',
      action: 'Wajib Penutupan Akun Gantung'
    },
    {
      account: '2101-009 (Hutang Usaha Pihak Ketiga)',
      balance: 'Rp 450.000.000 (Unposted Batch)',
      desc: 'Batch transaksi hutang yang di-hold oleh staf tanpa justifikasi',
      health: 'Review Needed (Score 65%)',
      action: 'Audit Unposted Batch'
    }
  ],

  // 2. Vendor Forensics & OCR Invoices
  ocrInvoices: [
    {
      invoiceNo: 'INV-2024-00587',
      vendor: 'PT Maju Bersama',
      date: '30 Mei 2026',
      totalAmount: 'Rp 250.000.000',
      mathCheck: 'VALID (DPP + PPN 11%)',
      elaScore: '98% Fabricated (Photoshop Overlay)',
      bankMatch: 'MISMATCH (Mandiri Pribadi vs BCA Resmi)',
      status: 'Payment Held'
    },
    {
      invoiceNo: 'INV-2024-00512',
      vendor: 'PT Nusantara Cargo',
      date: '28 Mei 2026',
      totalAmount: 'Rp 165.000.000',
      mathCheck: 'VALID',
      elaScore: '12% Normal (Asli)',
      bankMatch: 'MATCH (BCA 088-219)',
      status: 'Verified Clean'
    },
    {
      invoiceNo: 'INV-2024-00499',
      vendor: 'CV Karya Mandiri',
      date: '26 Mei 2026',
      totalAmount: 'Rp 145.000.000',
      mathCheck: 'SELISIH PPN 11% (Salah Hitung Rp 1.2M)',
      elaScore: '84% Suspicious (Font Mismatch)',
      bankMatch: 'MATCH',
      status: 'Audit Hold'
    }
  ],

  vendors: [
    {
      name: 'CV Maju Sentosa',
      npwp: '01.345.678.9-012.000',
      spend: 'Rp 4.5 M (18 PO)',
      flags: 'Split Purchase & Rekening Duplikat Internal',
      score: '92/100',
      mitigation: 'Freeze Vendor'
    },
    {
      name: 'PT Berkah Abadi',
      npwp: '02.987.654.3-014.000',
      spend: 'Rp 6.2 M (24 PO)',
      flags: 'Shell Company / Virtual Office Kosong',
      score: '88/100',
      mitigation: 'Blacklist Review'
    },
    {
      name: 'PT Sejahtera Utama',
      npwp: '01.888.999.1-011.000',
      spend: 'Rp 3.8 M (12 PO)',
      flags: 'Related Party (Kesamaan No Telp Manager Logistik)',
      score: '85/100',
      mitigation: 'Hold Tender'
    },
    {
      name: 'CV Karya Mandiri',
      npwp: '03.222.111.4-015.000',
      spend: 'Rp 1.9 M (8 PO)',
      flags: 'Faktur Pajak Dibatalkan Sepihak di DJP',
      score: '84/100',
      mitigation: 'Audit Tax Invoice'
    }
  ],

  relatedParties: [
    {
      vendor: 'PT Sejahtera Utama (VEND-0011)',
      internalStaff: 'Siti Wahyuni (Buyer Logistik)',
      role: 'Pembuat PO & Penilai Tender',
      matchType: 'Kesamaan Nomor Telepon & Alamat Domisili Direktur',
      risk: 'High Conflict Risk (Score 94)',
      action: 'Bekukan Vendor & Evaluasi Kontrak'
    },
    {
      vendor: 'CV Berkah Abadi (VEND-0014)',
      internalStaff: 'Rudi Hartono (Staff AP)',
      role: 'Staff Pembayaran Keuangan',
      matchType: 'Kesamaan Nomor Rekening Bank Tujuan Transfer',
      risk: 'Critical Conflict (Score 98)',
      action: 'Eskalasi ke Komite Audit'
    }
  ],

  bidRiggingTenders: [
    {
      tenderName: 'Pengadaan Armada Angkutan Logistik Jatim 2026',
      bidders: 'CV Maju Sentosa, CV Karya Mandiri, PT Berkah Abadi',
      ipAddress: '180.252.164.22 (IP Address Pengiriman Identik)',
      hpsVariance: '0.18% vs HPS (Maju Sentosa Pemenang)',
      flag: 'Kolusi Tender / Peserta Pendamping Fiktif (Bid Rigging)'
    }
  ],

  splitPurchases: [
    {
      groupRef: 'SPLIT-GRP-082',
      vendor: 'CV Maju Sentosa',
      pos: 'PO-901, PO-902, PO-903 (Diterbitkan Bersamaan)',
      value: '3x @ Rp 95.000.000 (Total Rp 285.000.000)',
      issuer: 'Siti Wahyuni (Buyer)',
      purpose: 'Penghindaran Batas Approval Direksi (> Rp 100 Juta)'
    }
  ],

  shellCompanies: [
    {
      name: 'PT Global Solusindo Cangkang',
      established: '1 Bulan Lalu (Entitas Baru)',
      address: 'Co-Working Space Virtual Office (Tanpa Ruang Fisik)',
      bpjsStatus: '0 Karyawan Terdaftar BPJS Ketenagakerjaan',
      score: '96% Shell Probability (Tolak Pendaftaran)'
    }
  ],

  // 3. Tax Equalization Data (NashTa x JendelaTax)
  taxEqualizationData: [
    {
      taxType: 'PPN Penyerahan (Keluaran) - Mei 2026',
      glValue: 'Rp 58.450.000.000',
      sptValue: 'Rp 56.950.000.000',
      djpValue: 'Rp 56.950.000.000',
      gap: '- Rp 1.500.000.000',
      category: 'Timing Diff (Rp 1.25M) + Un-invoiced (Rp 250M)'
    },
    {
      taxType: 'PPh Pasal 21 (Beban Gaji & Upah) - Mei 2026',
      glValue: 'Rp 12.800.000.000',
      sptValue: 'Rp 12.800.000.000',
      djpValue: 'Rp 12.800.000.000',
      gap: 'Rp 0',
      category: '100% Reconciled (Clean)'
    },
    {
      taxType: 'PPh Pasal 23 (Beban Jasa & Sewa) - Mei 2026',
      glValue: 'Rp 4.200.000.000',
      sptValue: 'Rp 3.950.000.000',
      djpValue: 'Rp 3.950.000.000',
      gap: '- Rp 250.000.000',
      category: 'Unpaid Withholding (Kasus AL-0516)'
    }
  ],

  efakturData: [
    {
      noFaktur: '010.000-24.88721901',
      lawan: 'CV Karya Mandiri',
      dpp: 'Rp 1.318.181.818',
      ppn: 'Rp 145.000.000',
      statusDJP: 'DIBATALKAN SEPIHAK OLEH VENDOR',
      action: 'Blokir Pengkreditan Pajak Masukan'
    },
    {
      noFaktur: '010.000-24.55192084',
      lawan: 'PT Nusantara Cargo',
      dpp: 'Rp 1.500.000.000',
      ppn: 'Rp 165.000.000',
      statusDJP: 'APPROVED & VALID (NTPN Sah)',
      action: 'Lolos Validasi SPT'
    }
  ],

  ebupotData: [
    {
      bupotNo: 'BUPOT-2026-9901',
      vendor: 'PT Maju Bersama',
      objek: 'PPh Pasal 23 (Jasa Angkutan Logistik)',
      dpp: 'Rp 250.000.000',
      pphDipungut: 'Rp 5.000.000',
      statusSetor: 'BELUM DISETOR KE KAS NEGARA (NTPN Kosong)'
    }
  ],

  restitusiData: [
    {
      periode: 'Masa Pajak April - Mei 2026',
      nilaiKlaim: 'Rp 5.120.000.000',
      redFlags: 'Faktur Masukan Berasal dari Vendor Cangkang (Score 89)',
      rekomendasi: 'Hold Pengajuan Restitusi Sebelum Audit Lapangan KPP'
    }
  ],

  // 4. Operational & POS Data
  cashierVoidData: [
    {
      kasir: 'Dina Lestari (Bandung Dago)',
      transaksi: '142 Struk',
      voidCount: '28 Struk Void',
      voidRatio: '19.7% (Abnormal > 3x Toko)',
      voidValue: 'Rp 14.500.000',
      flag: 'Indikasi Skimming Kas Masuk'
    },
    {
      kasir: 'Budi Prasetyo (Surabaya Timur)',
      transaksi: '180 Struk',
      voidCount: '15 Struk Void',
      voidRatio: '8.3% (Tinggi)',
      voidValue: 'Rp 8.200.000',
      flag: 'Void Pasca-Pelanggan Keluar'
    }
  ],

  phantomSalesData: [
    {
      outlet: 'Outlet Surabaya Timur',
      trxDate: '31 Mei 2026, 21:00 WIB (Akhir Bulan)',
      voidDate: '1 Juni 2026, 08:30 WIB (Awal Bulan)',
      amount: 'Rp 34.500.000',
      motif: 'Rekayasa Pencapaian Target Omset Bonus Bulanan'
    }
  ],

  inventoryShrinkageData: [
    {
      sku: 'SKU-88129 (Daging Sapi Premium Import)',
      gudang: 'Pusat Distribusi Cikarang',
      stockSistem: '1.450 Kg',
      stockFisik: '1.180 Kg',
      selisih: '- 270 Kg (Hilang / Shrinkage)',
      lossValue: 'Rp 37.800.000'
    }
  ],

  deliveryTransitData: [
    {
      sjNo: 'SJ-2026-9901',
      ekspedisi: 'PT Maju Logistik',
      asal: 'Gudang Pusat Cikarang',
      tujuan: 'Outlet Bandung Dago',
      kirim: '500 Karton',
      terima: '420 Karton',
      selisih: '- 80 Karton (Transit Loss Rekayasa)'
    }
  ],

  refundFraudData: [
    {
      trxNo: 'REF-2026-0041',
      outlet: 'Outlet Bandung Dago',
      kasir: 'Dina Lestari',
      item: '5 Pcs Audio Headphone',
      refundValue: 'Rp 12.500.000 (Tunai)',
      alasan: 'Retur Dana Tunai Tanpa Bukti Struk Asli Pembeli'
    }
  ],

  // 5. Case Management Queue
  cases: [
    {
      id: 'AL-2024-0516',
      title: 'Pembayaran ganda ke rekening baru vendor (Duplicate Payment)',
      module: 'Financial & UEBA',
      entity: 'PT Maju Bersama',
      amount: 'Rp 250.000.000',
      severity: 'High',
      status: 'In Progress',
      investigator: 'Budi Santoso, CFE'
    },
    {
      id: 'AL-2024-0515',
      title: 'Faktur pajak masukan tidak sah / terindikasi fiktif di DJP',
      module: 'Tax Equalization',
      entity: 'CV Karya Mandiri',
      amount: 'Rp 145.000.000',
      severity: 'High',
      status: 'New',
      investigator: 'Dewi Anggraini'
    },
    {
      id: 'AL-2024-0514',
      title: 'Jurnal manual penyesuaian angka bulat (Round Amount)',
      module: 'Financial & UEBA',
      entity: 'PT Global Makmur',
      amount: 'Rp 500.000.000',
      severity: 'High',
      status: 'In Progress',
      investigator: 'Andi Wijaya'
    },
    {
      id: 'AL-2024-0513',
      title: 'Benturan kepentingan pengadaan (Related Party Conflict)',
      module: 'Vendor Forensics',
      entity: 'PT Sejahtera Utama',
      amount: 'Rp 1.200.000.000',
      severity: 'High',
      status: 'Assigned',
      investigator: 'Rudi Hartono'
    }
  ],

  // 6. Evidence Vault
  evidence: [
    {
      name: 'Invoice_INV-2024-00587.pdf',
      type: 'PDF Document',
      source: 'AP Vendor Attachment',
      caseId: 'AL-2024-0516',
      hash: '8f9b2a64c7e14d8892bf30198ca115e2',
      time: '30 Mei 2026, 10:38',
      uploader: 'Budi Santoso'
    },
    {
      name: 'Bank_Mandiri_Transfer_002.pdf',
      type: 'Bank Slip',
      source: 'Mandiri Cash Management',
      caseId: 'AL-2024-0516',
      hash: '3a1c89f92b7741e099811234acfe9012',
      time: '30 Mei 2026, 10:36',
      uploader: 'Budi Santoso'
    },
    {
      name: 'SAP_Change_Log_MasterVendor.json',
      type: 'ERP CDC Log',
      source: 'SAP CDPOS Connector',
      caseId: 'AL-2024-0516',
      hash: 'e49981190cbb7841908234ea77812901',
      time: '30 Mei 2026, 10:22',
      uploader: 'System Auto-Capture'
    }
  ],

  // 7. User Management
  users: [
    { name: 'Budi Santoso, CFE', email: 'budi.santoso@nashta.co.id', role: 'Lead Forensic Auditor', dept: 'Internal Audit & Compliance', status: 'Active', login: 'Hari ini, 10:20' },
    { name: 'Dewi Anggraini', email: 'dewi.anggraini@nashta.co.id', role: 'Senior Tax Analyst', dept: 'Tax & Accounting', status: 'Active', login: 'Hari ini, 09:45' },
    { name: 'Andi Wijaya', email: 'andi.wijaya@nashta.co.id', role: 'Forensic Investigator', dept: 'Internal Audit', status: 'Active', login: 'Hari ini, 09:10' },
    { name: 'Siti Rahma', email: 'siti.rahma@nashta.co.id', role: 'Compliance Officer', dept: 'Risk & Governance', status: 'Active', login: 'Kemarin, 16:30' }
  ]
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderAllTables();
  initAllCharts();
  renderWorkspaceGraph();
  initSoDMatrix();
});

// --- NAVIGATION & ROUTING ---
function initNavigation() {
  // Main sidebar nav buttons
  document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });

  // Collapsible nav groups
  document.querySelectorAll('.nav-group-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = header.closest('.nav-group');
      parent.classList.toggle('open');
    });
  });

  // Sub-items in sidebar
  document.querySelectorAll('.nav-sub-items .sub-item').forEach(sub => {
    sub.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = sub.getAttribute('data-view');
      const targetSub = sub.getAttribute('data-sub');
      if (targetView) switchView(targetView, targetSub);
    });
  });

  // In-module subnav buttons
  document.querySelectorAll('.module-subnav-bar .subnav-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSub = btn.getAttribute('data-sub');
      const parentModule = btn.closest('.view-panel').id.replace('view-', '');
      if (parentModule && targetSub) switchView(parentModule, targetSub);
    });
  });

  // Sidebar toggle button (Handles both desktop collapse & mobile drawer)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-mobile-open');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
      window.dispatchEvent(new Event('resize'));
    });
  }

  // Sidebar backdrop click (Closes mobile drawer)
  const backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      document.body.classList.remove('sidebar-mobile-open');
    });
  }
}

function switchView(viewName, subViewName) {
  // Auto-close sidebar on mobile after choosing a menu
  if (window.innerWidth <= 768) {
    document.body.classList.remove('sidebar-mobile-open');
  }

  state.currentView = viewName;
  const sub = subViewName || state.currentSubView[viewName] || 'overview';
  state.currentSubView[viewName] = sub;

  // 1. Switch View Panel
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) targetPanel.classList.add('active');

  // 2. Switch Sub-View Panes
  const prefixMap = {
    financial: 'fin-sub-',
    procurement: 'proc-sub-',
    tax: 'tax-sub-',
    approvals: 'app-sub-',
    operational: 'ops-sub-'
  };

  const prefix = prefixMap[viewName];
  if (prefix && targetPanel) {
    targetPanel.querySelectorAll('.sub-view-pane').forEach(pane => pane.classList.remove('active'));
    const targetPane = document.getElementById(`${prefix}${sub}`);
    if (targetPane) {
      targetPane.classList.add('active');
    } else {
      const firstPane = targetPanel.querySelector('.sub-view-pane');
      if (firstPane) firstPane.classList.add('active');
    }

    // Update in-module subnav tab buttons
    const subnavBar = document.getElementById(`subnav-${viewName}`);
    if (subnavBar) {
      subnavBar.querySelectorAll('.subnav-tab-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-sub') === sub) b.classList.add('active');
      });
    }

    // Update sidebar sub-item active state
    document.querySelectorAll(`#sub-${viewName} .sub-item`).forEach(si => {
      si.classList.remove('active');
      if (si.getAttribute('data-sub') === sub) si.classList.add('active');
    });

    // Make sure parent group is open
    const parentGroup = document.querySelector(`button[data-group="${viewName}"]`);
    if (parentGroup) parentGroup.closest('.nav-group').classList.add('open');
  }

  // 3. Update main sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-btn').forEach(b => {
    b.classList.remove('active');
    if (b.getAttribute('data-view') === viewName) b.classList.add('active');
  });

  // 4. Update Breadcrumb
  const breadcrumb = document.getElementById('current-breadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = getModuleTitle(viewName, sub);
  }

  window.dispatchEvent(new Event('resize'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getModuleTitle(viewName, subName) {
  const titles = {
    financial: `1. Financial & UEBA > ${subName.toUpperCase()}`,
    procurement: `2. Procurement & Vendor Forensics > ${subName.toUpperCase()}`,
    tax: `3. Tax Equalization (NashTa × JendelaTax) > ${subName.toUpperCase()}`,
    approvals: `4. SoD & Override Behavior > ${subName.toUpperCase()}`,
    operational: `5. Operational & POS > ${subName.toUpperCase()}`,
    case_mgmt: '6. Case Management & WBS Integration',
    executive: '7. Executive Dashboard & POJK 12/2024',
    investigation_detail: '8. Investigation Workspace (Deep-Dive AL-2024-0516)',
    evidence_mgmt: '9. Digital Evidence Vault (SHA-256)',
    user_access: '10. User & Access Control'
  };
  return titles[viewName] || 'Dashboard';
}

// --- RENDER ALL DATA TABLES ---
function renderAllTables() {
  // 1. UEBA Overview Table
  const tUeba = document.getElementById('table-fin-ueba-body');
  if (tUeba) {
    tUeba.innerHTML = state.uebaOutliers.map(u => `
      <tr>
        <td><strong class="font-mono">${u.id}</strong><br><span style="font-size:0.75rem; color:#64748b;">${u.name}</span></td>
        <td><span class="badge-tag blue">${u.role}</span></td>
        <td><span class="badge-tag red font-bold">${u.anomaly}</span></td>
        <td class="font-mono">${u.time}</td>
        <td class="font-mono font-bold text-danger">${u.amount}</td>
        <td><span class="badge-score red">${u.score}/100</span></td>
        <td><span class="badge-tag orange">${u.action}</span></td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="openCaseDetail('AL-2024-0516')">Buka Kasus &rarr;</button>
        </td>
      </tr>
    `).join('');
  }

  // 1.2 User Profiling
  const tProf = document.getElementById('table-fin-profiling-body');
  if (tProf) {
    tProf.innerHTML = state.userProfiling.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.dept}</td>
        <td style="font-size: 0.75rem; color: #64748b;">${p.baseline}</td>
        <td style="font-size: 0.75rem; color: #b91c1c; font-weight: 600;">${p.recent}</td>
        <td><span class="badge-tag red">${p.drift}</span></td>
        <td><span class="badge-score red">${p.status}</span></td>
        <td class="text-right"><button class="btn btn-secondary btn-xs" onclick="showToast('Buka profil UEBA user: ${p.name}')">Inspect</button></td>
      </tr>
    `).join('');
  }

  // 1.3 Off-Hours Journal Table
  const tOff = document.getElementById('table-fin-offhours-table');
  if (tOff) {
    tOff.innerHTML = `
      <thead>
        <tr>
          <th>No Jurnal (Voucher)</th>
          <th>Waktu Posting ERP</th>
          <th>User Input</th>
          <th>Pos Akun Debet / Kredit</th>
          <th>Nominal</th>
          <th>Anomali</th>
          <th class="text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${state.offhoursJournals.map(j => `
          <tr>
            <td class="font-mono font-bold">${j.jrnNo}</td>
            <td class="font-mono text-danger">${j.date}</td>
            <td><strong>${j.user}</strong></td>
            <td style="font-size: 0.75rem;">${j.accounts}</td>
            <td class="font-mono font-bold text-danger">${j.amount}</td>
            <td><span class="badge-tag red">${j.anomaly}</span></td>
            <td class="text-right"><button class="btn btn-danger btn-xs" onclick="showToast('Voucher ${j.jrnNo} dibekukan')">Freeze</button></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 1.4 Velocity Table
  const tVel = document.getElementById('table-fin-velocity-table');
  if (tVel) {
    tVel.innerHTML = `
      <thead>
        <tr>
          <th>Nama Approver</th>
          <th>Peran di ERP</th>
          <th>Volume Approval</th>
          <th>Durasi Waktu</th>
          <th>Total Nilai</th>
          <th>Indikator Forensik</th>
          <th>Skor Risiko</th>
        </tr>
      </thead>
      <tbody>
        ${state.velocityDrifts.map(v => `
          <tr>
            <td><strong>${v.user}</strong></td>
            <td>${v.role}</td>
            <td class="font-mono font-bold">${v.totalAppr}</td>
            <td class="font-mono text-danger font-bold">${v.timeSpent}</td>
            <td class="font-mono text-danger">${v.value}</td>
            <td><span class="badge-tag red">${v.flag}</span></td>
            <td><span class="badge-score red">${v.score}/100</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 1.5 Tampering Table
  const tTamp = document.getElementById('table-fin-tampering-table');
  if (tTamp) {
    tTamp.innerHTML = `
      <thead>
        <tr>
          <th>User Pelaku Edit</th>
          <th>Vendor Sasaran</th>
          <th>Field yang Dimodifikasi</th>
          <th>Nilai Sebelum</th>
          <th>Nilai Sesudah (Manipulasi)</th>
          <th>Jeda Waktu ke Pembayaran</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${state.prePaymentEdits.map(t => `
          <tr>
            <td><strong>${t.user}</strong></td>
            <td>${t.vendor}</td>
            <td>${t.field}</td>
            <td class="font-mono" style="font-size: 0.72rem;">${t.before}</td>
            <td class="font-mono font-bold text-danger" style="font-size: 0.72rem;">${t.after}</td>
            <td class="font-mono text-danger">${t.timeDelta}</td>
            <td><span class="badge-tag red font-bold">${t.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 1.6 CoA Table
  const tCoa = document.getElementById('table-fin-gl-table');
  if (tCoa) {
    tCoa.innerHTML = `
      <thead>
        <tr>
          <th>Nomor & Nama Akun GL</th>
          <th>Saldo Gantung / Clearing</th>
          <th>Keterangan Anomali</th>
          <th>Status Kesehatan CoA</th>
          <th class="text-right">Tindakan</th>
        </tr>
      </thead>
      <tbody>
        ${state.coaIntegrity.map(c => `
          <tr>
            <td class="font-mono font-bold">${c.account}</td>
            <td class="font-mono font-bold text-danger">${c.balance}</td>
            <td style="font-size: 0.75rem;">${c.desc}</td>
            <td><span class="badge-tag red">${c.health}</span></td>
            <td class="text-right"><button class="btn btn-secondary btn-xs" onclick="showToast('Audit akun GL dibuka')">Rekonsiliasi</button></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 2. Vendor Risk Table
  const tVen = document.getElementById('table-proc-vendor-body');
  if (tVen) {
    tVen.innerHTML = state.vendors.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td class="font-mono">${v.npwp}</td>
        <td class="font-mono font-bold">${v.spend}</td>
        <td><span class="badge-tag red">${v.flags}</span></td>
        <td><span class="badge-score red">${v.score}</span></td>
        <td><span class="badge-tag orange">${v.mitigation}</span></td>
        <td class="text-right">
          <button class="btn btn-primary btn-xs" onclick="openOcrInspectorModal('INV-2024-00587')">OCR Forensics</button>
        </td>
      </tr>
    `).join('');
  }

  // 2.2 OCR Forensics Table
  const tOcr = document.getElementById('table-proc-ocr-table');
  if (tOcr) {
    tOcr.innerHTML = `
      <thead>
        <tr>
          <th>No Invoice</th>
          <th>Nama Vendor</th>
          <th>Tanggal Berkas</th>
          <th>Nilai Tagihan</th>
          <th>OCR Math Checksum</th>
          <th>ELA Pixel Tamper Score</th>
          <th>Pencocokan Rekening Fisik vs ERP</th>
          <th class="text-right">Inspeksi</th>
        </tr>
      </thead>
      <tbody>
        ${state.ocrInvoices.map(o => `
          <tr>
            <td class="font-mono font-bold">${o.invoiceNo}</td>
            <td><strong>${o.vendor}</strong></td>
            <td>${o.date}</td>
            <td class="font-mono font-bold text-danger">${o.totalAmount}</td>
            <td><span class="badge-tag ${o.mathCheck.includes('VALID') ? 'green' : 'red'}">${o.mathCheck}</span></td>
            <td><span class="badge-tag red font-bold">${o.elaScore}</span></td>
            <td><span class="badge-tag ${o.bankMatch.includes('MISMATCH') ? 'red' : 'green'}">${o.bankMatch}</span></td>
            <td class="text-right">
              <button class="btn btn-primary btn-xs" onclick="openOcrInspectorModal('${o.invoiceNo}')"><i class="fa-solid fa-microscope"></i> Inspector</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 2.3 Vendor 360 Deep-Dive
  const v360 = document.getElementById('vendor-360-container');
  if (v360) {
    v360.innerHTML = `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; color: #0f172a;">PT Maju Bersama (VEND-0098)</h3>
            <p style="font-size: 0.78rem; color: #64748b;">NIB: 9120003418821 | NPWP: 01.345.678.9-012.000 | Status: <span class="badge-tag red">HIGH RISK / ON HOLD</span></p>
          </div>
          <button class="btn btn-danger btn-sm" onclick="showToast('Vendor PT Maju Bersama dibekukan permanen')">Freeze Vendor</button>
        </div>
        <div class="grid-3col" style="margin-bottom: 16px;">
          <div style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 0.72rem; color: #64748b;">Total PO Spend (YTD)</span>
            <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">Rp 4.500.000.000</div>
          </div>
          <div style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 0.72rem; color: #64748b;">Rekening Resmi Terdaftar</span>
            <div style="font-size: 0.85rem; font-weight: 700; color: #065f46;">Bank BCA: 012-345-6789</div>
          </div>
          <div style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 0.72rem; color: #64748b;">Rekening Siluman Terdeteksi</span>
            <div style="font-size: 0.85rem; font-weight: 700; color: #b91c1c;">Bank Mandiri: 137-00-998811-2</div>
          </div>
        </div>
        <p style="font-size: 0.8rem; color: #334155;"><strong>Temuan Red Flags:</strong> Ditemukan faktur ganda INV-2024-00587 dengan hasil OCR manipulasi nomor rekening atas nama staf internal Rudi Hartono.</p>
      </div>
    `;
  }

  // 2.4 Related Party Table
  const tRel = document.getElementById('table-proc-related-table');
  if (tRel) {
    tRel.innerHTML = `
      <thead>
        <tr>
          <th>Nama Vendor Rekanan</th>
          <th>Staf Internal Terafiliasi</th>
          <th>Jabatan & Wewenang Internal</th>
          <th>Bentuk Kesamaan Data (Matching)</th>
          <th>Tingkat Risiko Konflik</th>
          <th class="text-right">Tindakan</th>
        </tr>
      </thead>
      <tbody>
        ${state.relatedParties.map(r => `
          <tr>
            <td><strong>${r.vendor}</strong></td>
            <td class="font-bold">${r.internalStaff}</td>
            <td>${r.role}</td>
            <td style="font-size: 0.75rem;">${r.matchType}</td>
            <td><span class="badge-tag red font-bold">${r.risk}</span></td>
            <td class="text-right"><button class="btn btn-danger btn-xs" onclick="showToast('${r.action}')">${r.action}</button></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 2.5 Tender Table
  const tTnd = document.getElementById('table-proc-tender-table');
  if (tTnd) {
    tTnd.innerHTML = `
      <thead>
        <tr>
          <th>Nama Paket Tender</th>
          <th>Peserta Lelang Terlibat</th>
          <th>Jejak Digital (IP / Metadata)</th>
          <th>Selisih vs HPS</th>
          <th>Temuan Kolusi</th>
        </tr>
      </thead>
      <tbody>
        ${state.bidRiggingTenders.map(t => `
          <tr>
            <td><strong>${t.tenderName}</strong></td>
            <td>${t.bidders}</td>
            <td class="font-mono text-danger">${t.ipAddress}</td>
            <td class="font-mono font-bold">${t.hpsVariance}</td>
            <td><span class="badge-tag red">${t.flag}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 2.6 Split Table
  const tSpl = document.getElementById('table-proc-split-table');
  if (tSpl) {
    tSpl.innerHTML = `
      <thead>
        <tr>
          <th>Ref Pemecahan</th>
          <th>Vendor Penerima</th>
          <th>Nomor PO Terkait</th>
          <th>Akumulasi Nilai</th>
          <th>Pembuat PO</th>
          <th>Tujuan Indikasi Fraud</th>
        </tr>
      </thead>
      <tbody>
        ${state.splitPurchases.map(s => `
          <tr>
            <td class="font-mono font-bold">${s.groupRef}</td>
            <td><strong>${s.vendor}</strong></td>
            <td>${s.pos}</td>
            <td class="font-mono font-bold text-danger">${s.value}</td>
            <td>${s.issuer}</td>
            <td><span class="badge-tag orange">${s.purpose}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 2.7 Shell Table
  const tShl = document.getElementById('table-proc-shell-table');
  if (tShl) {
    tShl.innerHTML = `
      <thead>
        <tr>
          <th>Nama Badan Usaha</th>
          <th>Usia Perusahaan</th>
          <th>Verifikasi Alamat Fisik</th>
          <th>Status Ketenagakerjaan</th>
          <th>Skor Probabilitas Cangkang</th>
        </tr>
      </thead>
      <tbody>
        ${state.shellCompanies.map(s => `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.established}</td>
            <td style="font-size: 0.75rem;">${s.address}</td>
            <td><span class="badge-tag red">${s.bpjsStatus}</span></td>
            <td><span class="badge-score red">${s.score}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 3. Tax Equalization Table
  const tTax = document.getElementById('table-tax-equalization-body');
  if (tTax) {
    tTax.innerHTML = state.taxEqualizationData.map(t => `
      <tr>
        <td><strong>${t.taxType}</strong></td>
        <td class="font-mono">${t.glValue}</td>
        <td class="font-mono">${t.sptValue}</td>
        <td class="font-mono font-bold text-success">${t.djpValue}</td>
        <td class="font-mono font-bold ${t.gap === 'Rp 0' ? 'text-success' : 'text-danger'}">${t.gap}</td>
        <td><span class="badge-tag ${t.gap === 'Rp 0' ? 'green' : 'red'}">${t.category}</span></td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="showToast('Detail rekonsiliasi ${t.taxType}')">Detail</button>
        </td>
      </tr>
    `).join('');
  }

  // 3.2 e-Faktur Table
  const tEf = document.getElementById('table-tax-efaktur-table');
  if (tEf) {
    tEf.innerHTML = `
      <thead>
        <tr>
          <th>Nomor Seri Faktur Pajak</th>
          <th>Lawan Transaksi</th>
          <th>Dasar Pengenaan Pajak (DPP)</th>
          <th>PPN 11%</th>
          <th>Status Server DJP (JendelaTax Sync)</th>
          <th class="text-right">Tindakan</th>
        </tr>
      </thead>
      <tbody>
        ${state.efakturData.map(e => `
          <tr>
            <td class="font-mono font-bold">${e.noFaktur}</td>
            <td><strong>${e.lawan}</strong></td>
            <td class="font-mono">${e.dpp}</td>
            <td class="font-mono font-bold text-danger">${e.ppn}</td>
            <td><span class="badge-tag ${e.statusDJP.includes('DIBATALKAN') ? 'red font-bold' : 'green'}">${e.statusDJP}</span></td>
            <td class="text-right"><button class="btn btn-secondary btn-xs" onclick="showToast('${e.action}')">${e.action}</button></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 3.3 e-Bupot Table
  const tEb = document.getElementById('table-tax-ebupot-table');
  if (tEb) {
    tEb.innerHTML = `
      <thead>
        <tr>
          <th>No Bukti Potong</th>
          <th>Vendor / Penerima Penghasilan</th>
          <th>Objek Pemotongan PPh</th>
          <th>Nilai Tagihan Bruto (DPP)</th>
          <th>PPh Terutang</th>
          <th>Status Penyetoran ke Kas Negara</th>
        </tr>
      </thead>
      <tbody>
        ${state.ebupotData.map(b => `
          <tr>
            <td class="font-mono font-bold">${b.bupotNo}</td>
            <td><strong>${b.vendor}</strong></td>
            <td>${b.objek}</td>
            <td class="font-mono">${b.dpp}</td>
            <td class="font-mono font-bold text-danger">${b.pphDipungut}</td>
            <td><span class="badge-tag red font-bold">${b.statusSetor}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 3.6 Restitusi Table
  const tRes = document.getElementById('table-tax-restitusi-table');
  if (tRes) {
    tRes.innerHTML = `
      <thead>
        <tr>
          <th>Periode Pengajuan Restitusi</th>
          <th>Nilai Klaim Lebih Bayar</th>
          <th>Indikator Red Flags Rantai Pasok</th>
          <th>Rekomendasi Tim Pajak</th>
        </tr>
      </thead>
      <tbody>
        ${state.restitusiData.map(r => `
          <tr>
            <td><strong>${r.periode}</strong></td>
            <td class="font-mono font-bold text-danger">${r.nilaiKlaim}</td>
            <td><span class="badge-tag red">${r.redFlags}</span></td>
            <td style="font-size: 0.75rem;">${r.rekomendasi}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 4. Toxic Table
  const tTox = document.getElementById('table-app-toxic-body');
  if (tTox) {
    tTox.innerHTML = `
      <tr>
        <td><strong>USR-AP-088 (Rudi Hartono)</strong></td>
        <td>Staff Accounts Payable</td>
        <td><span class="badge-tag red font-bold">Create Master Vendor + Approve Payment</span></td>
        <td class="font-mono font-bold text-danger">7 Transaksi</td>
        <td><span class="badge-score red">CRITICAL (Toxic)</span></td>
        <td class="text-right"><button class="btn btn-danger btn-xs" onclick="showToast('Hak akses Master Vendor dicabut')">Revoke Akses</button></td>
      </tr>
      <tr>
        <td><strong>USR-PR-042 (Siti Wahyuni)</strong></td>
        <td>Procurement Specialist</td>
        <td><span class="badge-tag orange font-bold">Create Purchase Order + Approve Invoice</span></td>
        <td class="font-mono">5 Transaksi</td>
        <td><span class="badge-score orange">HIGH RISK</span></td>
        <td class="text-right"><button class="btn btn-secondary btn-xs" onclick="showToast('Eskalasi ke Komite Audit')">Review</button></td>
      </tr>
    `;
  }

  // 4.3 Override Table
  const tOvr = document.getElementById('table-app-override-table');
  if (tOvr) {
    tOvr.innerHTML = `
      <thead>
        <tr>
          <th>Waktu Kejadian</th>
          <th>Pejabat Pelaku Override</th>
          <th>Nilai Transaksi</th>
          <th>Batas Pagu Standar</th>
          <th>Alasan / Memo Terlampir</th>
          <th>Status Kepatuhan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-mono">29 Mei 2026 16:20</td>
          <td><strong>Manager Logistik (Hendra W.)</strong></td>
          <td class="font-mono text-danger font-bold">Rp 180.000.000</td>
          <td class="font-mono">Rp 100.000.000</td>
          <td>"Kebutuhan Operasional Mendesak Akhir Bulan"</td>
          <td><span class="badge-tag orange">Unjustified Memo (Pelanggaran SOP)</span></td>
        </tr>
      </tbody>
    `;
  }

  // 4.4 Rubber Stamping Table
  const tRub = document.getElementById('table-app-rubber-table');
  if (tRub) {
    tRub.innerHTML = `
      <thead>
        <tr>
          <th>Nama Penyetuju</th>
          <th>Waktu Rata-Rata Buka Dokumen</th>
          <th>Volume Approval Tergesa</th>
          <th>Total Nilai Diloloskan</th>
          <th>Tingkat Risiko</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Hendra Wijaya (Manager Operasional)</strong></td>
          <td class="font-mono text-danger font-bold">2.4 Detik / Dokumen</td>
          <td>35 PO dalam 2 Menit</td>
          <td class="font-mono font-bold">Rp 1.450.000.000</td>
          <td><span class="badge-score red">HIGH (Rubber Stamping)</span></td>
        </tr>
      </tbody>
    `;
  }

  // 4.5 Privilege Creep Table
  const tPriv = document.getElementById('table-app-privilege-table');
  if (tPriv) {
    tPriv.innerHTML = `
      <thead>
        <tr>
          <th>Nama Akun User</th>
          <th>Status Karyawan</th>
          <th>Hak Akses Menumpuk</th>
          <th>Rekomendasi Tata Kelola</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Bambang Irawan</strong></td>
          <td>Mutasi dari AP ke GL (3 Bulan Lalu)</td>
          <td><span class="badge-tag red">Masih memiliki hak akses AP_PAYMENT_ADMIN</span></td>
          <td><span class="badge-tag red font-bold">Cabut Akses AP Segera</span></td>
        </tr>
      </tbody>
    `;
  }

  // 5. Operational Tables
  const tCashier = document.getElementById('table-ops-cashier-table');
  if (tCashier) {
    tCashier.innerHTML = `
      <thead>
        <tr>
          <th>Kasir / Outlet</th>
          <th>Total Struk</th>
          <th>Void Struk</th>
          <th>Void Ratio</th>
          <th>Nilai Void</th>
        </tr>
      </thead>
      <tbody>
        ${state.cashierVoidData.map(c => `
          <tr>
            <td><strong>${c.kasir}</strong></td>
            <td>${c.transaksi}</td>
            <td class="font-mono font-bold text-danger">${c.voidCount}</td>
            <td><span class="badge-tag red font-bold">${c.voidRatio}</span></td>
            <td class="font-mono text-danger">${c.voidValue}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  const tPhn = document.getElementById('table-ops-phantom-table');
  if (tPhn) {
    tPhn.innerHTML = `
      <thead>
        <tr>
          <th>Outlet Cabang</th>
          <th>Waktu Input Transaksi</th>
          <th>Waktu Pembatalan (Void)</th>
          <th>Nominal Transaksi</th>
          <th>Indikasi Motif Fraud</th>
        </tr>
      </thead>
      <tbody>
        ${state.phantomSalesData.map(p => `
          <tr>
            <td><strong>${p.outlet}</strong></td>
            <td class="font-mono">${p.trxDate}</td>
            <td class="font-mono text-danger">${p.voidDate}</td>
            <td class="font-mono font-bold text-danger">${p.amount}</td>
            <td><span class="badge-tag orange">${p.motif}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  const tInv = document.getElementById('table-ops-inventory-table');
  if (tInv) {
    tInv.innerHTML = `
      <thead>
        <tr>
          <th>Kode & Nama SKU</th>
          <th>Lokasi Gudang</th>
          <th>Stok Sistem ERP</th>
          <th>Stok Fisik Opname</th>
          <th>Selisih Fisik</th>
          <th>Nilai Kerugian</th>
        </tr>
      </thead>
      <tbody>
        ${state.inventoryShrinkageData.map(i => `
          <tr>
            <td><strong>${i.sku}</strong></td>
            <td>${i.gudang}</td>
            <td class="font-mono">${i.stockSistem}</td>
            <td class="font-mono">${i.stockFisik}</td>
            <td class="font-mono font-bold text-danger">${i.selisih}</td>
            <td class="font-mono font-bold text-danger">${i.lossValue}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  const tDel = document.getElementById('table-ops-delivery-table');
  if (tDel) {
    tDel.innerHTML = `
      <thead>
        <tr>
          <th>No Surat Jalan</th>
          <th>Ekspedisi</th>
          <th>Rute Pengiriman</th>
          <th>Jumlah Kirim</th>
          <th>Jumlah Terima</th>
          <th>Selisih Transit</th>
        </tr>
      </thead>
      <tbody>
        ${state.deliveryTransitData.map(d => `
          <tr>
            <td class="font-mono font-bold">${d.sjNo}</td>
            <td>${d.ekspedisi}</td>
            <td>${d.asal} &rarr; ${d.tujuan}</td>
            <td class="font-mono">${d.kirim}</td>
            <td class="font-mono">${d.terima}</td>
            <td><span class="badge-tag red font-bold">${d.selisih}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  const tRef = document.getElementById('table-ops-return-table');
  if (tRef) {
    tRef.innerHTML = `
      <thead>
        <tr>
          <th>No Transaksi Retur</th>
          <th>Outlet & Kasir</th>
          <th>Barang Diretur</th>
          <th>Pengembalian Kas</th>
          <th>Temuan Anomali</th>
        </tr>
      </thead>
      <tbody>
        ${state.refundFraudData.map(r => `
          <tr>
            <td class="font-mono font-bold">${r.trxNo}</td>
            <td>${r.outlet} (${r.kasir})</td>
            <td>${r.item}</td>
            <td class="font-mono font-bold text-danger">${r.refundValue}</td>
            <td><span class="badge-tag red">${r.alasan}</span></td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // 6. Case Management Table
  const tCase = document.getElementById('table-case-queue-body');
  if (tCase) {
    tCase.innerHTML = state.cases.map(c => `
      <tr>
        <td><strong class="font-mono text-danger">${c.id}</strong></td>
        <td><strong>${c.title}</strong></td>
        <td><span class="badge-tag blue">${c.module}</span></td>
        <td><strong>${c.entity}</strong></td>
        <td class="font-mono font-bold text-danger">${c.amount}</td>
        <td><span class="badge-score red">${c.severity}</span></td>
        <td><span class="badge-tag orange">${c.status}</span></td>
        <td>${c.investigator}</td>
        <td class="text-right">
          <button class="btn btn-primary btn-xs" onclick="openCaseDetail('${c.id}')">Buka Workspace &rarr;</button>
        </td>
      </tr>
    `).join('');
  }

  // 8. Workspace Evidence List
  const wsEvList = document.getElementById('workspace-evidence-list');
  if (wsEvList) {
    wsEvList.innerHTML = state.evidence.map(e => `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <i class="fa-solid fa-file-shield text-danger"></i> <strong>${e.name}</strong><br>
          <span style="font-size: 0.68rem; font-family: monospace; color: #64748b;">SHA-256: ${e.hash.slice(0, 18)}... (MATCH)</span>
        </div>
        <button class="btn btn-secondary btn-xs" onclick="openOcrInspectorModal('INV-2024-00587')"><i class="fa-solid fa-eye"></i></button>
      </div>
    `).join('');
  }

  // 9. Evidence Vault Full Table
  const tVault = document.getElementById('table-evidence-vault-body');
  if (tVault) {
    tVault.innerHTML = state.evidence.map(e => `
      <tr>
        <td><i class="fa-solid fa-file-pdf text-danger"></i> <strong>${e.name}</strong></td>
        <td><span class="badge-tag blue">${e.type}</span></td>
        <td>${e.source}</td>
        <td class="font-mono font-bold text-danger">${e.caseId}</td>
        <td class="font-mono text-muted" style="font-size: 0.7rem;">${e.hash}</td>
        <td>${e.time}</td>
        <td><strong>${e.uploader}</strong></td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="openOcrInspectorModal('INV-2024-00587')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-secondary btn-xs" onclick="showToast('Mengunduh paket bukti SHA-256')"><i class="fa-solid fa-download"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // 10. Users List Table
  const tUsers = document.getElementById('table-users-list-body');
  if (tUsers) {
    tUsers.innerHTML = state.users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="badge-tag orange">${u.role}</span></td>
        <td>${u.dept}</td>
        <td><span class="badge-score green">${u.status}</span></td>
        <td>${u.login}</td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="showToast('Ubah hak akses: ${u.name}')"><i class="fa-solid fa-pen"></i></button>
        </td>
      </tr>
    `).join('');
  }
}

// --- SOD MATRIX RENDERER ---
function initSoDMatrix() {
  const container = document.getElementById('sod-full-matrix-container');
  if (!container) return;

  const actions = ['Create Vendor', 'Create PO', 'Approve PO', 'Approve Payment', 'Record Journal'];
  const matrixData = [
    [0, 1, 3, 7, 1],
    [1, 0, 3, 5, 0],
    [3, 3, 0, 2, 0],
    [7, 5, 2, 0, 1],
    [1, 0, 0, 1, 0]
  ];

  let html = '<div class="sod-cell header">Aktivitas / Otorisasi</div>';
  actions.forEach(a => { html += `<div class="sod-cell header">${a}</div>`; });

  actions.forEach((rowAct, rIdx) => {
    html += `<div class="sod-cell header">${rowAct}</div>`;
    actions.forEach((colAct, cIdx) => {
      const val = matrixData[rIdx][cIdx];
      const cls = val === 0 ? 'safe' : val <= 2 ? 'review' : 'danger';
      const txt = val === 0 ? 'Aman (0)' : val <= 2 ? `Review (${val})` : `Pelanggaran (${val})`;
      html += `<div class="sod-cell ${cls}">${txt}</div>`;
    });
  });

  container.innerHTML = html;
}

// --- CHART.JS INITIALIZATION ---
function initAllCharts() {
  // 1. Off-Hours Journal Line Chart
  const ctxOff = document.getElementById('chart-fin-offhours');
  if (ctxOff) {
    new Chart(ctxOff, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:45'],
        datasets: [
          { label: 'Normal Working Hours Baseline', data: [0, 0, 45, 120, 95, 10, 0], borderColor: '#3B82F6', tension: 0.3 },
          { label: 'Off-Hours Anomalies (Night Posting)', data: [12, 8, 0, 0, 0, 18, 38], borderColor: '#D92525', backgroundColor: 'rgba(217, 37, 37, 0.15)', fill: true, tension: 0.4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 1b. User Behavior Donut
  const ctxUDonut = document.getElementById('chart-fin-user-donut');
  if (ctxUDonut) {
    new Chart(ctxUDonut, {
      type: 'doughnut',
      data: {
        labels: ['Off-Hours Journal (38%)', 'Rubber-Stamping (28%)', 'Pre-Payment Edit (22%)', 'Split PO (12%)'],
        datasets: [{
          data: [38, 28, 22, 12],
          backgroundColor: ['#D92525', '#EA580C', '#F59E0B', '#6366F1']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
    });
  }

  // 2. Vendor Scatter Plot
  const ctxScatter = document.getElementById('chart-proc-scatter');
  if (ctxScatter) {
    new Chart(ctxScatter, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Sangat Tinggi (CV Maju, PT Berkah, PT Sejahtera)',
            data: [{x: 8.8, y: 9.2}, {x: 8.2, y: 8.7}, {x: 9.1, y: 8.0}],
            backgroundColor: '#D92525',
            pointRadius: 8
          },
          {
            label: 'Tinggi (CV Karya, PT Global)',
            data: [{x: 6.5, y: 7.2}, {x: 7.0, y: 6.4}],
            backgroundColor: '#F59E0B',
            pointRadius: 6
          },
          {
            label: 'Rendah (898 Vendor Bersih)',
            data: [{x: 1.5, y: 2.0}, {x: 2.1, y: 1.8}, {x: 2.5, y: 2.2}],
            backgroundColor: '#10B981',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Dampak Finansial (Rp Miliar)' } },
          y: { title: { display: true, text: 'Tingkat Probabilitas / ELA Tamper Score' } }
        }
      }
    });
  }

  // 3. Tax Gap Bar Chart
  const ctxTaxGap = document.getElementById('chart-tax-gap');
  if (ctxTaxGap) {
    new Chart(ctxTaxGap, {
      type: 'bar',
      data: {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei'],
        datasets: [
          { label: 'Penjualan Buku Besar (GL)', data: [48, 52, 54, 55, 58.45], backgroundColor: '#3B82F6' },
          { label: 'DPP SPT Masa PPN 1111', data: [47.2, 51.1, 53.0, 54.2, 56.95], backgroundColor: '#F59E0B' },
          { label: 'Selisih Anomali Tax Gap', data: [0.8, 0.9, 1.0, 0.8, 1.5], backgroundColor: '#D92525' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 5. POS Area Chart
  const ctxPos = document.getElementById('chart-ops-pos');
  if (ctxPos) {
    new Chart(ctxPos, {
      type: 'line',
      data: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '21:00 (Tutup)'],
        datasets: [{
          label: 'Spike Anomali Void Pasca-Customer',
          data: [2, 3, 5, 4, 8, 14, 45],
          borderColor: '#D92525',
          backgroundColor: 'rgba(217, 37, 37, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 7. Executive Recovery Chart
  const ctxExecRec = document.getElementById('chart-exec-recovery');
  if (ctxExecRec) {
    new Chart(ctxExecRec, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [{
          label: 'Dana Diselamatkan (Rp Miliar)',
          data: [12.5, 16.8, 20.2, 24.5, 28.45, 33.1],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 7b. Regional Risk Heatmap Bar
  const ctxExecReg = document.getElementById('chart-exec-regional');
  if (ctxExecReg) {
    new Chart(ctxExecReg, {
      type: 'bar',
      data: {
        labels: ['Jakarta Selatan', 'Surabaya Timur', 'Bandung Dago', 'Medan Center', 'Makassar Mall', 'Denpasar Bali'],
        datasets: [{
          label: 'Skor Risiko Cabang',
          data: [92, 88, 85, 80, 78, 45],
          backgroundColor: ['#D92525', '#D92525', '#D92525', '#EA580C', '#F59E0B', '#10B981'],
          borderRadius: 6
        }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  }
}

// --- SVG NETWORK GRAPH FOR WORKSPACE ---
function renderWorkspaceGraph() {
  const container = document.getElementById('workspace-graph-container');
  if (!container) return;

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 650 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nodeRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </radialGradient>
        <radialGradient id="nodeBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#1e40af"/>
        </radialGradient>
      </defs>

      <!-- Connections -->
      <line x1="325" y1="180" x2="160" y2="100" stroke="#64748b" stroke-width="2" stroke-dasharray="4"/>
      <line x1="325" y1="180" x2="500" y2="100" stroke="#ef4444" stroke-width="3"/>
      <line x1="325" y1="180" x2="200" y2="280" stroke="#10b981" stroke-width="2"/>
      <line x1="325" y1="180" x2="460" y2="280" stroke="#ef4444" stroke-width="3"/>
      <line x1="500" y1="100" x2="460" y2="280" stroke="#ef4444" stroke-width="2" stroke-dasharray="2"/>

      <!-- Center Node: AL-2024-0516 -->
      <circle cx="325" cy="180" r="30" fill="url(#nodeRed)"/>
      <text x="325" y="185" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">AL-0516</text>

      <!-- Node: PT Maju Bersama -->
      <circle cx="160" cy="100" r="26" fill="url(#nodeBlue)"/>
      <text x="160" y="104" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">PT Maju</text>
      <text x="160" y="136" fill="#94a3b8" font-size="9" text-anchor="middle">Vendor Master</text>

      <!-- Node: Rudi Hartono (Staff AP) -->
      <circle cx="500" cy="100" r="28" fill="url(#nodeRed)"/>
      <text x="500" y="104" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Rudi H.</text>
      <text x="500" y="136" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Staff AP (Tamperer)</text>

      <!-- Node: Rek Resmi BCA -->
      <circle cx="200" cy="280" r="24" fill="#10b981"/>
      <text x="200" y="284" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">BCA #1</text>
      <text x="200" y="316" fill="#10b981" font-size="9" text-anchor="middle">Rek Resmi</text>

      <!-- Node: Rek Siluman Mandiri -->
      <circle cx="460" cy="280" r="28" fill="url(#nodeRed)"/>
      <text x="460" y="284" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Mandiri #2</text>
      <text x="460" y="316" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">Rek Pribadi Suspect</text>
    </svg>
  `;
}

// --- MODALS & USER ACTIONS ---
function openCaseDetail(caseId) {
  switchView('investigation_detail', 'overview');
  showToast(`Membuka berkas perkara digital dossier: ${caseId}`);
}

function openOcrInspectorModal(invoiceId) {
  const m = document.getElementById('modal-ocr-inspector');
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

function triggerTaxSync() {
  showToast('Sinkronisasi H2H JendelaTax <-> DJP berhasil! Ekualisasi dihitung ulang.');
  const valGL = document.getElementById('eq-gl-val');
  if (valGL) valGL.textContent = 'Rp 58.450.000.000 (Synced)';
}

function openDropzoneModal() {
  switchView('tax', 'dropzone');
}

function openUploadEvidenceModal() {
  showToast('Pilih dokumen bukti untuk dihitung SHA-256 Checksum otomatis...');
}

function openNewCaseModal() {
  const title = prompt('Masukkan judul berkas perkara investigasi baru:', 'Anomali Pengadaan Logistik Jawa Timur');
  if (title) {
    state.cases.unshift({
      id: `AL-2024-${Date.now().toString().slice(-4)}`,
      title: title,
      module: 'Procurement Forensics',
      entity: 'CV Maju Sentosa',
      amount: 'Rp 450.000.000',
      severity: 'High',
      status: 'New',
      investigator: 'Budi Santoso, CFE'
    });
    renderAllTables();
    showToast('Berkas perkara baru berhasil didaftarkan ke antrean triase.');
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-shield-halved text-danger"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
