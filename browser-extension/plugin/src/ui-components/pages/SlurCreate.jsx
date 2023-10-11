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
    SelectMultiple
} from 'grommet';
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext, NotificationContext } from '../atoms/AppContext';
import { slurCreatePluginToApi } from '../../slur-crowdsource/adapters';
import {
    categoryOptions,
    defaultMetadata
} from '../../slur-crowdsource/values';

const { createSlurAndCategory } = Api;

export function SlurCreate() {
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const [formData, setFormData] = useState(defaultMetadata);
    const [showWarning, setShowWarning] = useState(false);

    const navigate = useNavigate();
    // const handleGoBack = () => {
    //     navigate('/slur');
    // };

    const handleSubmit = async ({ value }) => {
        let newValue = slurCreatePluginToApi(value);
        try {
            await createSlurAndCategory(user.accessToken, newValue);
            navigate('/slur');
            showNotification({
                type: 'message',
                message: 'Slur Created'
            });
        } catch (err) {
            console.error('Error creating slur', err);
            showNotification({
                type: 'error',
                message: 'Could not create Slur'
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
        setFormData(defaultMetadata);
        setShowWarning(false);
    };

    return (
        <Box gap="medium">
            {/* <Anchor onClick={handleGoBack}>Go Back</Anchor> */}
            <Text size="large" alignSelf="center">
                <strong>
                    <u>Add Slur</u>
                </strong>
            </Text>

            <Form
                value={formData}
                onChange={(nextValue) => {
                    // console.log(nextValue);
                    setFormData(nextValue);
                }}
                onSubmit={handleSubmit}
            >
                <FormField
                    name="label"
                    label={'Label'}
                    required={{ indicator: true }}
                >
                    <TextInput id="slur-form-label" name="label" />
                </FormField>

                <FormField
                    name="levelOfSeverity"
                    label={'Level of Severity'}
                    required={{ indicator: true }}
                >
                    <RadioButtonGroup
                        name="levelOfSeverity"
                        direction="row"
                        options={['low', 'medium', 'high']}
                    />
                </FormField>

                <FormField name="casual" label={'Casual'} required>
                    <RadioButtonGroup
                        id="slur-form-casual"
                        name="casual"
                        direction="row"
                        options={[
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 2 }
                        ]}
                    />
                </FormField>

                <FormField
                    name="appropriated"
                    label="Appropriated"
                    required
                >
                    <RadioButtonGroup
                        id="slur-form-appropriated"
                        name="appropriated"
                        direction="row"
                        options={[
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 2 }
                        ]}
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
                        options={[
                            { label: 'Community', value: 1 },
                            { label: 'Others', value: 2 }
                        ]}
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
