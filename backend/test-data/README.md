# GUARDIAN Test Data

Bu klasör, GUARDIAN ML audit sistemini test etmek için örnek model ve veri içerir.

## Hızlı Başlangıç

### 1. Test Modeli Oluştur

```bash
cd backend/test-data
python create_test_model.py
```

Bu komut şunları oluşturur:
- `test_model.pkl` - Eğitilmiş RandomForest classifier
- `test_data.csv` - 1000 sample test verisi

### 2. Model Upload Et

**Frontend üzerinden:**
1. http://localhost:5500 adresine git
2. Giriş yap (test@test.com / 123456)
3. Models > Upload Model
4. `test_model.pkl` dosyasını seç
5. Framework: Scikit-learn

**API üzerinden:**
```bash
# Login ve token al
curl -X POST http://localhost:3010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'

# Model upload (token'ı değiştir)
curl -X POST http://localhost:3010/api/models/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Credit Risk Classifier" \
  -F "framework=sklearn" \
  -F "model=@test_model.pkl"
```

### 3. Audit Çalıştır

**Frontend üzerinden:**
1. Models sayfasında modeli bul
2. "Run Audit" butonuna tıkla
3. Audits sayfasından sonuçları takip et

**API üzerinden:**
```bash
# Audit başlat (model_id'yi değiştir)
curl -X POST http://localhost:3010/api/audits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "MODEL_ID"}'

# Audit sonuçlarını al
curl http://localhost:3010/api/audits/AUDIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Verisi Hakkında

`test_data.csv` şu özellikleri içerir:

| Feature | Açıklama | Tip |
|---------|----------|-----|
| age | Yaş (18-70) | int |
| income | Gelir | float |
| debt_ratio | Borç oranı (0-1) | float |
| credit_history_length | Kredi geçmişi (yıl) | int |
| num_credit_accounts | Kredi hesap sayısı | int |
| payment_history_score | Ödeme skoru (0-100) | float |
| employment_years | Çalışma süresi (yıl) | int |
| education_level | Eğitim seviyesi (1-4) | int |
| gender | Cinsiyet (0/1) - Hassas özellik | int |
| region_code | Bölge kodu (1-10) | int |
| label | Onay durumu (0=Red, 1=Onay) | int |

**Not:** `gender` özelliği kasıtlı olarak hafif bir bias içerir - bu GUARDIAN'ın bias detection özelliğini test etmek içindir.

## Beklenen Audit Sonuçları

Test modeli için beklenen yaklaşık değerler:

- **Compliance Score:** 65-75%
- **Bias Score:** 0.15-0.25 (gender bias nedeniyle)
- **Fairness Score:** 0.70-0.85

Audit raporu şunları göstermelidir:
- Gender özelliğinde demographic parity ihlali
- Income ve payment_history_score'un en önemli özellikler olduğu
- Bias azaltma önerileri

## Dosyalar

```
test-data/
├── README.md              # Bu dosya
├── create_test_model.py   # Model oluşturma scripti
├── test_model.pkl         # Eğitilmiş model (script çalıştırıldıktan sonra)
└── test_data.csv          # Test verisi (script çalıştırıldıktan sonra)
```

## Gereksinimler

```bash
pip install scikit-learn pandas numpy joblib
```
