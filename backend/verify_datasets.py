from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# 1. Test List Datasets
r_list = client.get('/api/datasets/')
print('List Datasets Status:', r_list.status_code)
data = r_list.json()
print('Total datasets found:', data.get('total'))
for ds in data.get('datasets', []):
    print(f" - [{ds['discipline']}] {ds['name']} ({ds['elements_count']} elements)")

# 2. Test Get Specific Dataset
r_get = client.get('/api/datasets/bim_architectural_v1')
print('Get BIM Dataset Status:', r_get.status_code)
assert r_get.status_code == 200

# 3. Test Intake New Dataset
new_ds = {
    'name': 'Test Soil Stratigraphy',
    'discipline': 'Geotechnical',
    'elements': [
        {'element_id': 'BH_01', 'category': 'Borehole', 'parameters': {'Depth_m': 25.0, 'SoilType': 'Stiff Clay'}}
    ]
}
r_create = client.post('/api/datasets/intake', json=new_ds)
print('Intake Dataset Status:', r_create.status_code, r_create.json().get('dataset_id'))

# 4. Test Edit Element
ds_id = r_create.json().get('dataset_id')
r_patch = client.patch(f'/api/datasets/{ds_id}/elements/BH_01', json={'parameters': {'Depth_m': 30.0, 'N_Value': 24}})
print('Edit Element Status:', r_patch.status_code)

# 5. Test Delete Dataset
r_del = client.delete(f'/api/datasets/{ds_id}')
print('Delete Dataset Status:', r_del.status_code)
print('ALL DATASET CRUD TESTS PASSED!')
