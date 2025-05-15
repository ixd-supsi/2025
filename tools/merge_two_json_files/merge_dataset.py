import pandas as pd

json_a = '/Applications/MAMP/htdocs/lavoro/corso-ixd/2025/tools/merge_two_json_files/datasets/colore.json'
json_b = '/Applications/MAMP/htdocs/lavoro/corso-ixd/2025/tools/merge_two_json_files/datasets/dati.json'

# carica json
df_a = pd.read_json(json_a)
df_b = pd.read_json(json_b)

# ottieni le colonne su cui fare il merge 
df_a['FileName'] = df_a['FileName'].astype(str).str.strip()
df_b['FileName'] = df_b['FileName'].astype(str).str.strip()

# merge dei due file sulla base della colonna 'FileName'
merged_df = pd.merge(df_a, df_b, on='FileName', how='outer')

# rimuove le righe con valori nulli in 'EXIF/ModifyDate' e 'Colors'
df_clean_0 = merged_df[merged_df['EXIF/ModifyDate'].notna()]
df_clean_1 = df_clean_0[df_clean_0['Colors'].notna()]

# estrae le colonne 'EXIF/ModifyDate' e 'Colors' e crea una nuova tabella
dataset = df_clean_1[['EXIF/ModifyDate','Colors']]

# esporta la nuova tabella in un file json
dataset.to_json('/Applications/MAMP/htdocs/lavoro/corso-ixd/2025/tools/merge_two_json_files/datasets/output.json', 
    orient='records',
    lines=False, 
    indent=4,
    force_ascii=False)

