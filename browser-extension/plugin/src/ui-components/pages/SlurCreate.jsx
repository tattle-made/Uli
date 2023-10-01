import { useState, useContext } from 'react';
import {
    Box,
    Button,
    Form,
    FormField,
    Text,
    RadioButtonGroup,
    TextArea,
    TextInput,
    Anchor,
    Select
} from 'grommet';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext } from '../atoms/AppContext';

const { createSlurAndCategory } = Api;

const categoryOptions = [
    'gendered',
    'sexualized',
    'religion',
    'ethnicity',
    'political affiliation',
    'caste',
    'class',
    'body shaming',
    'ableist',
    'sexual identity',
    'other'
];
const levelOfSeverityOptions = ['low', 'medium', 'high'];

export function SlurCreate() {
    const { user } = useContext(UserContext);
    // const { notification, showNotification } = useContext(NotificationContext);
    const initialFormData = {
        label: '',
        level_of_severity: '',
        casual: false,
        appropriated: false,
        appropriationContext: false,
        categories: [],
        labelMeaning: ''
    };
    const [formData, setFormData] = useState(initialFormData);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/slur');
    };

    const handleSubmit = async () => {
        try {
            const categories = formData.categories.map((category) => ({
                category
            }));
            const requestData = {
                ...formData,
                categories
            };
            console.log('Data for backend', requestData);
            const response = await createSlurAndCategory(
                user.accessToken,
                requestData
            );
            await setFormData({
                ...response.data
            });
            navigate('/slur');
        } catch (error) {
            console.error('Error creating slur:', error);
        }
    };
    const handleReset = () => {
        setFormData(initialFormData);
    };

    return (
        <Box>
            <Anchor onClick={handleGoBack}>Go Back</Anchor>
            <Text size="large" alignSelf="center">
                <strong>
                    <u>Add Slur</u>
                </strong>
            </Text>
            <Form
                value={formData}
                onChange={(nextValue) => setFormData(nextValue)}
                onSubmit={({ value }) => {
                    handleSubmit(value);
                }}
            >
                <FormField name="label" label="Label" required>
                    <TextInput
                        id="slur-form-label"
                        name="label"
                        value={formData.label}
                        onChange={(e) =>
                            setFormData({ ...formData, label: e.target.value })
                        }
                    />
                </FormField>

                <FormField
                    name="level_of_severity"
                    label="Level of Severity"
                    required
                >
                    <RadioButtonGroup
                        name="level_of_severity"
                        direction="row"
                        options={levelOfSeverityOptions}
                        value={formData.level_of_severity}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                level_of_severity: event.target.value
                            })
                        }
                    />
                </FormField>

                <FormField name="casual" label="Casual" required={false}>
                    <RadioButtonGroup
                        id="slur-form-casual"
                        name="casual"
                        direction="row"
                        options={['Yes', 'No']}
                        value={formData.casual ? 'Yes' : 'No'}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                casual: e.target.value === 'Yes'
                            })
                        }
                    />
                </FormField>

                <FormField
                    name="appropriated"
                    label="Appropriated"
                    required={false}
                >
                    <RadioButtonGroup
                        id="slur-form-appropriated"
                        name="appropriated"
                        direction="row"
                        options={['Yes', 'No']}
                        value={formData.appropriated ? 'Yes' : 'No'}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                appropriated: e.target.value === 'Yes'
                            })
                        }
                    />
                </FormField>

                <FormField
                    name="appropriationContext"
                    label="Appropriation Context"
                    required={false}
                >
                    <RadioButtonGroup
                        id="slur-form-appropriationContext"
                        name="appropriationContext"
                        direction="row"
                        options={['Community', 'Others']}
                        value={
                            formData.appropriationContext
                                ? 'Community'
                                : 'Others'
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                appropriationContext:
                                    e.target.value === 'Community'
                            })
                        }
                    />
                </FormField>

                <FormField
                    name="labelMeaning"
                    label="What Makes it Problematic?"
                    required
                >
                    <TextArea
                        id="slur-form-label-meaning"
                        name="labelMeaning"
                        value={formData.labelMeaning}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                labelMeaning: e.target.value
                            })
                        }
                    />
                </FormField>

                <FormField
                    id="slur-form-categories"
                    name="categories"
                    label="Categories"
                    required
                >
                    <Select
                        id="slur-form-categories-select"
                        name="categories"
                        options={categoryOptions}
                        value={formData.categories}
                        onChange={({ value }) =>
                            setFormData({ ...formData, categories: value })
                        }
                        multiple
                    />
                </FormField>

                <Box direction="row" gap="medium">
                    <Button
                        type="submit"
                        primary
                        label="Submit"
                        id="slur-form-submit-button"
                    />
                    <Button type="reset" label="Reset" onClick={handleReset} />
                </Box>
            </Form>
        </Box>
    );
}

export default SlurCreate;
