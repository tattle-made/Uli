import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Form,
    FormField,
    Heading,
    RadioButtonGroup,
    SelectMultiple,
    TextArea,
    TextInput,
    Anchor,
    Text
} from 'grommet';
import { useNavigate, useParams } from 'react-router-dom';
import Api from './Api';
import { UserContext, NotificationContext } from '../atoms/AppContext';

const { getSlurAndCategoryById, updateSlurAndCategory } = Api;

import {
    categoryOptions,
    defaultMetadata
} from '../../slur-crowdsource/values';
import {
    slurCreateApiToPlugin,
    slurCreatePluginToApi
} from '../../slur-crowdsource/adapters';

export function SlurEdit() {
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(defaultMetadata);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        async function fetchSlurData() {
            try {
                const data = await getSlurAndCategoryById(user.accessToken, id);
                console.log(data);
                const modifiedData = slurCreateApiToPlugin(data);
                setFormData(modifiedData);
            } catch (error) {
                console.error(error);
            }
        }

        fetchSlurData();
    }, [user.accessToken, id]);

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
    const handleGoBack = () => {
        navigate('/slur');
    };

    const handleSubmit = async ({ value }) => {
        let newValue = slurCreatePluginToApi(value);
        try {
            await updateSlurAndCategory(user.accessToken, id, newValue);
            navigate('/slur');
            showNotification({
                type: 'message',
                message: 'Slur Edited'
            });
        } catch (error) {
            console.error('Error updating slur:', error);
            showNotification({
                type: 'error',
                message: 'Error - Failed to Edit Slur'
            });
        }
    };

    return (
        <Box>
            <Anchor onClick={handleGoBack}>Go Back</Anchor>
            <Heading level={3} weight={900} alignSelf="center">
                Edit Slur
            </Heading>
            <Form
                value={formData}
                onChange={(nextValue) => setFormData(nextValue)}
                onSubmit={handleSubmit}
            >
                <FormField name="label" label={'Label'} required>
                    <TextInput id="slur-form-label" name="label" />
                </FormField>

                <FormField
                    name="level_of_severity"
                    label={'Level of Severity'}
                    required
                >
                    <RadioButtonGroup
                        name="level_of_severity"
                        direction="row"
                        options={['low', 'medium', 'high']}
                    />
                </FormField>

                <FormField name="casual" label={'Casual'} required={false}>
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
                    label={'Appropriated'}
                    required={false}
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
                        // value={formData.categories}
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
                        label="Save"
                        id="slur-form-save-button"
                        disabled={showWarning}
                    />
                </Box>
            </Form>
        </Box>
    );
}

export default SlurEdit;
