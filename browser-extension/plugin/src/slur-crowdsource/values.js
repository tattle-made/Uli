const defaultMetadata = {
    label: '',
    levelOfSeverity: '',
    casual: undefined,
    appropriated: undefined,
    appropriationContext: undefined,
    categories: [],
    meaning: ''
};

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


export { defaultMetadata, categoryOptions };
