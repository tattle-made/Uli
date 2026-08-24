const defaultMetadata = {
    label: '',
    language: '',
    levelOfSeverity: '',
    casual: undefined,
    appropriated: undefined,
    appropriationContext: undefined,
    categories: [],
    meaning: ''
};

const languageOptions = [
    { value: 'asm', label: 'Assamese' },
    { value: 'ben', label: 'Bengali' },
    { value: 'brx', label: 'Bodo' },
    { value: 'doi', label: 'Dogri' },
    { value: 'guj', label: 'Gujarati' },
    { value: 'hin', label: 'Hindi' },
    { value: 'kan', label: 'Kannada' },
    { value: 'kas', label: 'Kashmiri' },
    { value: 'kok', label: 'Konkani' },
    { value: 'mai', label: 'Maithili' },
    { value: 'mal', label: 'Malayalam' },
    { value: 'mni', label: 'Manipuri' },
    { value: 'mar', label: 'Marathi' },
    { value: 'nep', label: 'Nepali' },
    { value: 'ori', label: 'Odiya' },
    { value: 'pan', label: 'Punjabi' },
    { value: 'san', label: 'Sanskrit' },
    { value: 'sat', label: 'Santhali' },
    { value: 'snd', label: 'Sindhi' },
    { value: 'tam', label: 'Tamil' },
    { value: 'tel', label: 'Telugu' },
    { value: 'urd', label: 'Urdu' },
    { value: 'eng', label: 'English' },
];

const categoryOptions = [
    {value: 'gendered', label: 'Gendered'},
    {value: 'sexualized', label: 'Sexualized'},
    {value: 'religion', label: 'Religion'},
    {value: 'ethnicity', label: 'Ethnicity'},
    {value: 'political_affiliation', label: 'Political Affiliation'},
    {value: 'caste', label: 'Caste'},
    {value: 'class', label: 'Class'},
    {value: 'body_shaming', label: 'Body Shaming'},
    {value: 'ableist', label: 'Ableist'},
    {value: 'sexual_identity', label: 'Sexual Identity'},
    {value: 'other', label: 'Other'}
];


export { defaultMetadata, categoryOptions, languageOptions };
