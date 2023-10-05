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
    SelectMultiple
} from 'grommet';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext, NotificationContext } from '../atoms/AppContext';

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

export function SlurCreate() {
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const initialFormData = {
        label: '',
        level_of_severity: '',
        casual: undefined,
        appropriated: false,
        appropriationContext: false,
        categories: [],
        labelMeaning: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [showWarning, setShowWarning] = useState(false);

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
            // console.log('Data for backend', requestData);
            const response = await createSlurAndCategory(
                user.accessToken,
                requestData
            );
            await setFormData({
                ...response.data
            });
            navigate('/slur');
            showNotification({
                type: 'message',
                message: 'Slur Created'
            });
        } catch (error) {
            console.error('Error creating slur:', error);
            showNotification({
                type: 'error',
                message: 'Error - Could not create Slur'
            });
        }
    };
    const handleCategoryChange = ({ value }) => {
        if (value.length === 0) {
            setShowWarning(true);
            return;
        }
        if (value.length <= 4) {
            setShowWarning(false);
            setFormData({ ...formData, categories: value });
        } else {
            setShowWarning(true);
        }
    };
    const handleReset = () => {
        setFormData(initialFormData);
        setShowWarning(false);
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
                onChange={(nextValue) => {
                    console.log({ nextValue });
                    setFormData(nextValue);
                }}
                onSubmit={({ value }) => {
                    handleSubmit(value);
                }}
            >
                <FormField
                    name="label"
                    label={'Label'}
                    required={{ indicator: true }}
                >
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
                    label={'Level of Severity'}
                    required={{ indicator: true }}
                >
                    <RadioButtonGroup
                        name="level_of_severity"
                        direction="row"
                        options={['low', 'medium', 'high']}
                        value={formData.level_of_severity}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                level_of_severity: event.target.value
                            })
                        }
                    />
                </FormField>

                {/* <FormField
                    name="casual"
                    label={'Casual'}
                    required
                >
                    <RadioButtonGroup
                        id="slur-form-casual"
                        name="casual"
                        direction="row"
                        options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false }
                        ]}
                    />
                </FormField> */}

                <FormField name="casual" label={'Casual'} required>
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

                <FormField name="appropriated" label="Appropriated" required>
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
                    label="If, Appropriated, Is it by Community or Others?"
                    // required={false}
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
                    // required
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
                    label={'Categories'}
                    help={
                        <>
                            <Text size="small" color="#808080">
                                Select at least one and atmost four categories
                            </Text>
                        </>
                    }
                    required
                >
                    <SelectMultiple
                        id="slur-form-categories-select"
                        name="categories"
                        options={categoryOptions}
                        value={formData.categories}
                        onChange={handleCategoryChange}
                    />
                </FormField>
                {showWarning && (
                    <Box pad="small" background="status-warning" margin="small">
                        Please select at least one and at most four categories.
                    </Box>
                )}

                <Box direction="row" gap="medium">
                    <Button
                        type="submit"
                        primary
                        label="Submit"
                        id="slur-form-submit-button"
                        disabled={showWarning}
                    />
                    <Button type="reset" label="Reset" onClick={handleReset} />
                </Box>
            </Form>
        </Box>
    );
}

export default SlurCreate;
