const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#F4F5F7;--white:#FFF;--yellow:#F5C518;--yellowD:#D4A800;--yellowL:#FFFBEA;
    --orange:#FF6B2B;--orangeL:#FFF3ED;--green:#22C55E;--greenL:#F0FDF4;
    --blue:#3B82F6;--blueL:#EFF6FF;--red:#EF4444;--redL:#FEF2F2;
    --text:#111827;--text2:#374151;--muted:#6B7280;--border:#E5E7EB;
    --shadow:0 2px 12px rgba(0,0,0,0.07);--shadowM:0 4px 24px rgba(0,0,0,0.10);--radius:16px;
  }
  html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:'Nunito Sans',sans-serif;}
  h1,h2,h3,h4{font-family:'Nunito',sans-serif;}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
  .app{min-height:100vh;max-width:480px;margin:0 auto;background:var(--bg);}

  /* TOPBAR */
  .topbar{background:var(--white);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
  .logo{font-family:'Nunito',sans-serif;font-weight:900;font-size:20px;letter-spacing:-0.5px;}
  .logo span{color:var(--orange);}
  .live-pill{display:flex;align-items:center;gap:6px;background:var(--greenL);color:var(--green);font-size:12px;font-weight:700;padding:5px 10px;border-radius:100px;}
  .live-pill::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink 1.4s infinite;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  .user-ava{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;}
  .ua-s{background:var(--blueL);color:var(--blue);}
  .ua-d{background:var(--orangeL);color:var(--orange);}

  /* LANDING */
  .landing{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;background:var(--white);}
  .l-logo{font-family:'Nunito',sans-serif;font-weight:900;font-size:38px;letter-spacing:-1px;margin-bottom:6px;}
  .l-logo span{color:var(--orange);}
  .l-tag{font-size:14px;color:var(--muted);margin-bottom:48px;text-align:center;line-height:1.6;}
  .l-q{font-size:18px;font-weight:800;color:var(--text);margin-bottom:20px;}
  .role-cards{display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px;}
  .role-card{background:var(--white);border:2px solid var(--border);border-radius:18px;padding:22px 20px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:all 0.2s;box-shadow:var(--shadow);}
  .role-card:hover{border-color:var(--yellow);transform:translateY(-2px);box-shadow:var(--shadowM);}
  .rc-icon{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
  .rci-s{background:var(--blueL);}.rci-d{background:var(--orangeL);}
  .rc-text .rt{font-size:17px;font-weight:800;color:var(--text);}
  .rc-text .rs{font-size:12px;color:var(--muted);margin-top:2px;}
  .rc-arr{margin-left:auto;color:var(--muted);font-size:20px;}
  .l-foot{margin-top:44px;font-size:12px;color:var(--muted);text-align:center;line-height:1.7;}

  /* AUTH */
  .auth-page{min-height:100vh;background:var(--white);padding-bottom:40px;}
  .auth-back{display:flex;align-items:center;gap:8px;padding:16px 20px;font-size:14px;font-weight:700;color:var(--muted);cursor:pointer;border:none;background:none;}
  .auth-hero{padding:8px 24px 28px;}
  .auth-icon{font-size:48px;margin-bottom:12px;}
  .auth-title{font-size:26px;font-weight:900;margin-bottom:4px;}
  .auth-sub{font-size:14px;color:var(--muted);line-height:1.5;}
  .auth-tabs{display:flex;margin:0 24px 26px;background:var(--bg);border-radius:12px;padding:4px;}
  .auth-tab{flex:1;padding:10px;border-radius:10px;text-align:center;font-size:14px;font-weight:800;font-family:'Nunito',sans-serif;cursor:pointer;color:var(--muted);border:none;background:transparent;transition:all 0.2s;}
  .auth-tab.active{background:var(--white);color:var(--text);box-shadow:var(--shadow);}
  .auth-form{padding:0 24px;display:flex;flex-direction:column;gap:14px;}
  .f-group{display:flex;flex-direction:column;gap:6px;}
  .f-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
  .f-input{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;padding:13px 14px;font-size:15px;font-family:'Nunito Sans',sans-serif;color:var(--text);outline:none;transition:border-color 0.15s;}
  .f-input:focus{border-color:var(--yellow);background:var(--white);}
  .f-input::placeholder{color:var(--muted);}
  select.f-input{appearance:none;cursor:pointer;}
  .f-row{display:flex;gap:10px;}.f-row .f-group{flex:1;}
  .auth-btn{width:100%;background:var(--yellow);border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--text);cursor:pointer;margin-top:4px;box-shadow:0 4px 14px rgba(245,197,24,0.3);transition:all 0.2s;}
  .auth-btn:hover{background:var(--yellowD);transform:translateY(-1px);}
  .auth-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
  .auth-divider{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:12px;}
  .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border);}
  .err-msg{background:var(--redL);border:1px solid #FECACA;border-radius:10px;padding:10px 14px;font-size:13px;color:var(--red);font-weight:600;}
  .suc-msg{background:var(--greenL);border:1px solid #BBF7D0;border-radius:10px;padding:10px 14px;font-size:13px;color:var(--green);font-weight:600;}

  /* NAV */
  .bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--white);border-top:1px solid var(--border);display:flex;z-index:200;padding:6px 0 calc(6px + env(safe-area-inset-bottom));box-shadow:0 -4px 20px rgba(0,0,0,0.05);}
  .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 0;}
  .nav-icon{font-size:22px;}
  .nav-label{font-size:10px;font-weight:700;color:var(--muted);}
  .nav-item.active .nav-label{color:var(--orange);}

  /* STUDENT HOME */
  .hero{background:var(--white);padding:24px 20px 20px;border-bottom:1px solid var(--border);}
  .hero-lbl{font-size:12px;font-weight:700;color:var(--orange);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
  .hero-title{font-size:24px;font-weight:900;line-height:1.2;margin-bottom:3px;}
  .hero-sub{font-size:13px;color:var(--muted);}
  .stat-chips{display:flex;gap:8px;padding:14px 20px 0;}
  .stat-chip{display:flex;align-items:center;gap:6px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:6px 12px;font-size:12px;font-weight:600;color:var(--text2);box-shadow:var(--shadow);}
  .sc-dot{width:7px;height:7px;border-radius:50%;}
  .route-wrap{padding:14px 20px 0;}
  .route-card-ui{background:var(--white);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow);overflow:hidden;}
  .route-row{display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;transition:background 0.15s;}
  .route-row:hover{background:#FAFAFA;}
  .route-row+.route-row{border-top:1px solid var(--border);}
  .r-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .ri-from{background:var(--orangeL);}.ri-to{background:var(--greenL);}
  .r-lbl{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.4px;}
  .r-val{font-size:15px;font-weight:700;}
  .r-val.ph{color:var(--muted);font-weight:400;}
  .route-fare-preview{display:flex;align-items:center;justify-content:space-between;background:var(--yellowL);border:1px solid #FDE68A;border-radius:12px;padding:12px 16px;margin-top:12px;}
  .rfp-label{font-size:12px;color:var(--text2);font-weight:600;}
  .rfp-fare{font-size:18px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--text);}
  .rfp-note{font-size:11px;color:var(--muted);}
  .swap-center{display:flex;justify-content:center;}
  .swap-inner{width:30px;height:30px;border-radius:50%;background:var(--white);border:1.5px solid var(--border);box-shadow:var(--shadow);cursor:pointer;font-size:14px;color:var(--orange);font-weight:800;display:flex;align-items:center;justify-content:center;transition:transform 0.3s;}
  .swap-inner:hover{transform:rotate(180deg);}
  .find-btn{display:block;width:calc(100% - 40px);margin:18px auto 0;background:var(--yellow);color:var(--text);border:none;padding:15px;border-radius:14px;font-size:15px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(245,197,24,0.3);transition:all 0.2s;}
  .find-btn:hover{background:var(--yellowD);transform:translateY(-1px);}
  .find-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none;}
  .sec-block{padding:18px 20px 0;}
  .sec-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;}
  .pop-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;}
  .pop-chips::-webkit-scrollbar{display:none;}
  .pop-chip{background:var(--white);border:1px solid var(--border);border-radius:100px;padding:8px 14px;font-size:12px;font-weight:700;color:var(--text2);white-space:nowrap;cursor:pointer;box-shadow:var(--shadow);transition:all 0.15s;}
  .pop-chip:hover{border-color:var(--orange);color:var(--orange);background:var(--orangeL);}

  /* FARE TABLE PAGE */
  .fare-table-page{padding:20px 20px 100px;}
  .ft-title{font-size:22px;font-weight:900;margin-bottom:4px;}
  .ft-sub{font-size:13px;color:var(--muted);margin-bottom:20px;}
  .ft-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;margin-bottom:16px;}
  .ft-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}
  .ft-row:last-child{border:none;}
  .ft-route{font-size:14px;font-weight:700;}
  .ft-prices{display:flex;gap:16px;align-items:center;}
  .ft-solo{font-size:13px;color:var(--muted);}
  .ft-share{font-size:14px;font-weight:800;color:var(--green);}
  .incentive-explain{background:var(--yellowL);border:1px solid #FDE68A;border-radius:var(--radius);padding:16px;margin-bottom:16px;}
  .ie-title{font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px;}
  .ie-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #FDE68A;}
  .ie-row:last-child{border:none;}
  .ie-label{font-size:12px;color:var(--text2);}
  .ie-per{font-size:13px;font-weight:800;color:var(--text);}
  .ie-driver{font-size:11px;color:var(--green);font-weight:700;}

  /* SHEET (location picker) */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:400;display:flex;align-items:flex-end;justify-content:center;}
  .sheet{background:var(--white);border-radius:24px 24px 0 0;width:100%;max-width:480px;padding:16px 20px 36px;max-height:75vh;overflow-y:auto;animation:slideUp 0.25s ease;}
  @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
  .sheet-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 16px;}
  .sheet-title{font-size:16px;font-weight:900;margin-bottom:14px;}
  .loc-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;transition:background 0.15s;}
  .loc-item:hover{background:var(--bg);}
  .loc-em{width:40px;height:40px;background:var(--bg);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .loc-name{font-size:14px;font-weight:700;}
  .loc-code{font-size:12px;color:var(--muted);}

  /* LISTINGS */
  .page-hd{background:var(--white);padding:14px 20px;border-bottom:1px solid var(--border);}
  .route-badge{display:inline-flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--border);border-radius:100px;padding:7px 14px;font-size:13px;font-weight:700;margin-bottom:10px;}
  .rb-arr{color:var(--orange);}
  .avail-row{display:flex;gap:8px;flex-wrap:wrap;}
  .avail-pill{display:flex;align-items:center;gap:6px;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:5px 11px;font-size:12px;font-weight:700;color:var(--text2);}
  .ap-dot{width:7px;height:7px;border-radius:50%;}

  /* PRICE BREAKDOWN BANNER */
  .price-banner{margin:12px 16px;background:var(--yellowL);border:1px solid #FDE68A;border-radius:var(--radius);padding:14px 16px;}
  .pb-title{font-size:11px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;}
  .pb-cols{display:flex;gap:0;}
  .pb-col{flex:1;text-align:center;padding:0 8px;}
  .pb-col+.pb-col{border-left:1px solid #FDE68A;}
  .pb-passengers{font-size:12px;color:var(--muted);margin-bottom:4px;}
  .pb-per{font-size:18px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--text);}
  .pb-save{font-size:10px;color:var(--green);font-weight:700;margin-top:2px;}
  .pb-driver{font-size:10px;color:var(--orange);font-weight:700;margin-top:1px;}
  .pb-note{font-size:11px;color:var(--muted);margin-top:10px;text-align:center;}

  /* DECISION CARD */
  .dec-card{margin:0 16px 12px;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px;}
  .dec-lbl{font-size:11px;font-weight:800;color:var(--muted);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:10px;}
  .dec-opts{display:flex;gap:10px;}
  .dec-opt{flex:1;border:1.5px solid var(--border);border-radius:12px;padding:13px 10px;text-align:center;background:var(--bg);position:relative;}
  .dec-opt.win{border-color:var(--yellow);background:var(--yellowL);}
  .win-tag{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--yellow);color:var(--text);font-size:9px;font-weight:900;padding:2px 8px;border-radius:100px;white-space:nowrap;font-family:'Nunito',sans-serif;}
  .dec-act{font-size:13px;font-weight:700;color:var(--text2);margin-bottom:5px;}
  .dec-fare{font-size:20px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--text);}
  .dec-note{font-size:11px;color:var(--muted);margin-top:2px;}
  .dec-save{font-size:11px;color:var(--green);font-weight:700;margin-top:2px;}

  .filter-row{display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;}
  .filter-row::-webkit-scrollbar{display:none;}
  .f-chip{background:var(--white);border:1.5px solid var(--border);border-radius:100px;padding:7px 16px;font-size:12px;font-weight:700;color:var(--muted);white-space:nowrap;cursor:pointer;transition:all 0.15s;}
  .f-chip.on{background:var(--text);color:var(--white);border-color:var(--text);}

  /* RIDE CARDS */
  .rides-list{padding:0 16px 100px;display:flex;flex-direction:column;gap:12px;}
  .ride-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;animation:fadeUp 0.3s ease both;transition:box-shadow 0.2s,transform 0.2s;}
  .ride-card:hover{box-shadow:var(--shadowM);transform:translateY(-1px);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .ride-card.dimmed{opacity:0.45;}
  .rc-head{display:flex;align-items:center;gap:12px;padding:14px 16px 10px;}
  .drv-ava{width:44px;height:44px;border-radius:14px;font-family:'Nunito',sans-serif;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .da-auto{background:var(--orangeL);color:var(--orange);}
  .da-minivan{background:var(--greenL);color:var(--green);}
  .drv-info{flex:1;}
  .drv-name{font-size:15px;font-weight:800;}
  .drv-sub{font-size:12px;color:var(--muted);margin-top:1px;}
  .drv-stars{font-size:11px;color:#F5C518;margin-top:2px;}
  .eta-box{text-align:right;}
  .eta-num{font-size:20px;font-weight:900;font-family:'Nunito',sans-serif;}
  .eta-unit{font-size:11px;color:var(--muted);}
  .eta-live{font-size:10px;color:var(--green);font-weight:700;display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px;}
  .eta-live::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 1.4s infinite;}
  .seat-sec{padding:10px 16px 12px;border-top:1px solid var(--border);}
  .seat-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
  .seat-lbl{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;}
  .seat-cnt{font-size:12px;font-weight:700;}
  .seat-icons{display:flex;gap:5px;flex-wrap:wrap;}
  .si{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all 0.3s;}
  .si-taken{background:var(--orangeL);}
  .si-free{background:var(--bg);border:1.5px dashed var(--border);}
  .si-you{background:var(--greenL);border:1.5px solid var(--green);animation:pop 0.3s ease;}
  @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
  .seat-bar{height:5px;background:var(--bg);border-radius:3px;margin-top:8px;overflow:hidden;border:1px solid var(--border);}
  .seat-fill{height:100%;border-radius:3px;transition:width 0.5s ease;}
  .sf-auto{background:var(--orange);}.sf-minivan{background:var(--green);}

  /* PRICE INSIDE CARD */
  .rc-price{padding:10px 16px;border-top:1px solid var(--border);background:#FAFAFA;}
  .price-row{display:flex;align-items:center;gap:8px;}
  .pr-per{font-size:22px;font-weight:900;font-family:'Nunito',sans-serif;}
  .pr-tag{font-size:11px;color:var(--muted);}
  .pr-save{background:var(--greenL);color:var(--green);font-size:11px;font-weight:700;padding:3px 8px;border-radius:100px;margin-left:auto;}
  .pr-driver-earn{font-size:11px;color:var(--orange);margin-top:3px;font-weight:600;}
  .rc-foot{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid var(--border);}
  .btn-join{background:var(--yellow);color:var(--text);border:none;border-radius:10px;padding:11px 20px;font-size:13px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;transition:all 0.15s;white-space:nowrap;flex:1;}
  .btn-join:hover{background:var(--yellowD);}
  .btn-join:disabled{opacity:0.5;cursor:not-allowed;}
  .btn-solo{background:transparent;border:1.5px solid var(--border);color:var(--text2);border-radius:10px;padding:11px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.15s;}
  .btn-solo:hover{border-color:var(--text);}
  .full-tag{background:var(--bg);border:1px solid var(--border);color:var(--muted);font-size:12px;font-weight:700;padding:8px 14px;border-radius:8px;flex:1;text-align:center;}
  .empty{text-align:center;padding:50px 20px;background:var(--white);border-radius:var(--radius);border:1px solid var(--border);}
  .empty-icon{font-size:40px;margin-bottom:10px;}
  .empty-title{font-size:16px;font-weight:800;color:var(--text2);}
  .empty-sub{font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5;}
  .offline-lbl{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;padding:6px 0 4px;}

  /* CONFIRM */
  .confirm-wrap{padding:20px 20px 100px;}
  .confirm-top{text-align:center;padding:28px 0 22px;}
  .confirm-emoji{font-size:56px;animation:popIn 0.5s ease;}
  @keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
  .confirm-title{font-size:24px;font-weight:900;margin-top:10px;}
  .confirm-sub{font-size:13px;color:var(--muted);margin-top:4px;}
  .save-banner{background:var(--greenL);border:1px solid #BBF7D0;border-radius:14px;padding:16px;text-align:center;margin-bottom:14px;}
  .save-amount{font-size:24px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--green);}
  .save-label{font-size:13px;color:#15803D;margin-top:2px;}
  .driver-earn-banner{background:var(--orangeL);border:1px solid #FED7AA;border-radius:14px;padding:14px;text-align:center;margin-bottom:14px;}
  .deb-title{font-size:12px;color:var(--orange);font-weight:700;margin-bottom:2px;}
  .deb-amount{font-size:18px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--orange);}
  .info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:12px;overflow:hidden;}
  .info-row{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid var(--border);}
  .info-row:last-child{border:none;}
  .ir-lbl{font-size:13px;color:var(--muted);}
  .ir-val{font-size:14px;font-weight:700;}
  .ir-val.big{font-size:20px;font-family:'Nunito',sans-serif;}
  .ir-val.green{color:var(--green);}
  .ir-val.orange{color:var(--orange);}
  .btn-primary{display:block;width:100%;background:var(--yellow);border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:900;font-family:'Nunito',sans-serif;color:var(--text);cursor:pointer;box-shadow:0 4px 14px rgba(245,197,24,0.3);transition:all 0.2s;margin-bottom:10px;}
  .btn-primary:hover{background:var(--yellowD);}
  .btn-ghost{display:block;width:100%;background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:14px;font-size:14px;font-weight:700;color:var(--text2);cursor:pointer;transition:all 0.2s;}
  .btn-ghost:hover{border-color:var(--text);}

  /* DRIVER HOME */
  .drv-home{padding:0 0 100px;}
  .drv-hero{background:var(--white);padding:22px 20px 20px;border-bottom:1px solid var(--border);}
  .dh-welcome{font-size:14px;color:var(--muted);margin-bottom:4px;}
  .dh-name{font-size:24px;font-weight:900;}
  .dh-vehicle{font-size:13px;color:var(--muted);margin-top:2px;}
  .online-card{margin:16px 16px 0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:18px;}
  .oc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
  .oc-label{font-size:16px;font-weight:800;}
  .status-pill{padding:5px 12px;border-radius:100px;font-size:12px;font-weight:800;font-family:'Nunito',sans-serif;}
  .sp-on{background:var(--greenL);color:var(--green);}
  .sp-off{background:var(--redL);color:var(--red);}
  .tog-row{display:flex;gap:6px;background:var(--bg);border-radius:12px;padding:4px;}
  .tog-btn{flex:1;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;background:transparent;color:var(--muted);transition:all 0.2s;}
  .tog-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .tog-on{background:var(--green);color:#fff;}.tog-off{background:var(--red);color:#fff;}
  .drv-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 16px 0;}
  .dstat{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow);}
  .dstat-num{font-size:24px;font-weight:900;font-family:'Nunito',sans-serif;}
  .dstat-label{font-size:12px;color:var(--muted);margin-top:2px;}
  .seat-card{margin:14px 16px 0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}
  .seat-card-lbl{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;}
  .drv-incentive-card{margin:14px 16px 0;background:var(--orangeL);border:1px solid #FED7AA;border-radius:var(--radius);padding:16px;}
  .dic-title{font-size:12px;font-weight:800;color:var(--orange);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;}
  .dic-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #FED7AA;font-size:13px;}
  .dic-row:last-child{border:none;}
  .dic-label{color:var(--text2);}
  .dic-earn{font-weight:800;color:var(--orange);}
  .route-select-card{margin:14px 16px 0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;}
  .rsc-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;}

  /* PROFILE */
  .profile-page{padding:20px 20px 100px;}
  .profile-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px;text-align:center;margin-bottom:16px;}
  .profile-ava{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;font-family:'Nunito',sans-serif;margin:0 auto 14px;}
  .pa-s{background:var(--blueL);color:var(--blue);}.pa-d{background:var(--orangeL);color:var(--orange);}
  .profile-name{font-size:20px;font-weight:900;}
  .profile-email{font-size:13px;color:var(--muted);margin-top:4px;}
  .profile-role{display:inline-block;margin-top:10px;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:800;}
  .pr-s{background:var(--blueL);color:var(--blue);}.pr-d{background:var(--orangeL);color:var(--orange);}
  .logout-btn{width:100%;background:var(--redL);border:1px solid #FECACA;border-radius:14px;padding:14px;font-size:14px;font-weight:800;font-family:'Nunito',sans-serif;color:var(--red);cursor:pointer;transition:all 0.2s;margin-top:8px;}
  .logout-btn:hover{background:#FEE2E2;}

  /* TOAST */
  .toast{position:fixed;bottom:82px;left:50%;transform:translateX(-50%) translateY(12px);background:var(--text);color:var(--white);border-radius:100px;padding:10px 20px;font-size:13px;font-weight:700;z-index:999;white-space:nowrap;opacity:0;transition:all 0.25s;pointer-events:none;max-width:calc(100% - 40px);box-shadow:0 4px 20px rgba(0,0,0,0.2);}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  /* LOADING SPINNER */
  .spinner-wrap{display:flex;align-items:center;justify-content:center;padding:60px 0;}
  .spinner{width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--orange);border-radius:50%;animation:spin 0.7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

export default CSS;
