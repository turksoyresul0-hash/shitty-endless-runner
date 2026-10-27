# FPS Arena

Tarayıcıda çalışan, Three.js tabanlı 3D FPS oyunu ve Node.js/WebSocket multiplayer sunucusu.

**Canlı web önizlemesi:** https://turksoyresul0-hash.github.io/shitty-endless-runner/  
**Multiplayer sunucusu:** https://fps-arena-server.onrender.com/  
**Durum:** Geliştirme / kapalı test hazırlığı. GitHub Pages dağıtımı tek başına çok oyunculu oynanışın, Render sunucusunun veya tüm tarayıcıların doğrulandığı anlamına gelmez. Genel yayın öncesi aşağıdaki QA listesinin geçmesi gerekir.

## Geliştirme ortamı

Gereksinimler: Node.js 20+ ve npm.

```bash
npm install
npm start
```

Sunucu varsayılan olarak `PORT` ortam değişkenini veya `10000` portunu kullanır. `/` sağlık kontrolü JSON yanıtı döndürür. Oyunun istemcisi Three.js modülünü jsDelivr üzerinden yükler; geliştirme sırasında internet bağlantısı gerekir.

## Önemli dosyalar

- `index.html` — ana oyun, sahne, istemci kontrolleri, HUD ve silah seçimi
- `network-fix.js` — WebSocket istemcisi ve uzaktaki oyuncular
- `weapon-drop-visuals.js` — 3D yerdeki silahlar, yakınlık göstergesi ve toplama olayları
- `server.js` — oda bağlantıları, canlı maç kontrolü, sunucu taraflı hasar/ölüm/respawn ve silah düşürme-toplama
- `match-authority.js`, `combat-authority.js`, `movement-authority.js` — maç, çatışma ve hareket doğrulamaları
- `qa-server-test.js` — yerel multiplayer yaşam döngüsü ve savaş entegrasyon testi
- `.github/workflows/release-qa.yml` — Node modülleri, ana oyun modülü ve multiplayer testleri için CI

## Test

```bash
npm install
node --check server.js
node --check network-fix.js
node --check weapon-drop-visuals.js
node qa-server-test.js
```

`qa-server-test.js` yerel test sunucusunu başlatır ve otomatik oda/maç akışını, atış doğrulamasını, dost ateşini, görüş hattını, ölümü, silah düşürme/toplamayı ve respawn davranışını test eder. Testler başarıyla tamamlanmadan sürüm adayı olarak işaretlemeyin.

## Yayın öncesi kontrol listesi

- [x] Release QA GitHub Actions başarılı (son kontrol: 27 Ekim 2026).
- [ ] Render sağlık kontrolü ve WebSocket bağlantısı gerçek bir tarayıcıdan doğrulandı.
- [ ] İki ayrı oyuncuyla oda kurma, takım dağıtımı, hazır olma, maç başlangıcı ve maç sonu test edildi.
- [ ] Silah düşürme, başka oyuncunun toplaması, cephane/HUD ve respawn sonrası varsayılan silah doğrulandı.
- [ ] Masaüstü Chrome/Firefox ve gerçek bir mobil cihazda kontroller, ekran boyutları ve performans test edildi.
- [ ] Sohbet kötüye kullanımına karşı moderasyon ve sunucu yük sınırları gözden geçirildi.
- [ ] Platform SDK, reklam ve kozmetik/ödeme özellikleri yalnızca ilgili platformun inceleme ve politikalarına uygun biçimde etkinleştirildi.
- [ ] Gizlilik politikası ve kullanım koşulları gerçek veri akışına göre son kez incelendi.

## Gizlilik ve kullanım

- [Gizlilik Politikası](privacy.html)
- [Kullanım Koşulları](terms.html)

Oyun içi ilerleme, krediler ve bazı ayarlar tarayıcının `localStorage` alanında tutulabilir; tarayıcı verilerini silmek bu bilgileri kaldırabilir. Krediler sanal oyun içi bakiyedir; gerçek para değildir, nakde çevrilemez ve gerçek para ödülü değildir. Krediler sanal oyun içi bakiyedir; gerçek para değildir, nakde çevrilemez ve gerçek para ödülü değildir. Gerçek para ile satın alma sistemi, platform onayı ve güvenli bir ödeme sağlayıcısı entegrasyonu tamamlanmadan etkinleştirilmemelidir.

## Lisans

Bu depo için ayrıca bir açık kaynak lisansı belirtilmemiştir. Üçüncü taraf kütüphaneler kendi lisanslarına tabidir.
