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
        levelOfSeverity: '',
        casual: '',
        appropriated: '',
        appropriationContext: '',
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
                    name="levelOfSeverity"
                    label="Level of Severity"
                    required
                >
                    <RadioButtonGroup
                        name="levelOfSeverity"
                        direction="row"
                        options={levelOfSeverityOptions}
                        value={formData.levelOfSeverity}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                levelOfSeverity: event.target.value
                            })
                        }
                    />
                </FormField>

                <FormField name="casual" label="Casual" required>
                    <RadioButtonGroup
                        id="slur-form-casual"
                        name="casual"
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

                <FormField name="appropriated" label="Appropriated" required>
                    <RadioButtonGroup
                        id="slur-form-appropriated"
                        name="appropriated"
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
                    required
                >
                    <RadioButtonGroup
                        id="slur-form-appropriationContext"
                        name="appropriationContext"
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
