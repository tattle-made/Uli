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

const { getSlurAndCategory, updateSlurAndCategory } = Api;

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

export function SlurEdit() {
    const { user } = useContext(UserContext);
    const { showNotification } = useContext(NotificationContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        label: '',
        level_of_severity: '',
        casual: false,
        appropriated: false,
        appropriationContext: false,
        categories: [],
        labelMeaning: ''
    });
    const [, setSlurData] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        async function fetchSlurData() {
            try {
                const data = await getSlurAndCategory(user.accessToken);
                setSlurData(data);
                const editedSlur = data.find((slur) => slur.id === id);

                if (editedSlur) {
                    setFormData({
                        label: editedSlur.label,
                        level_of_severity: editedSlur.level_of_severity,
                        casual: editedSlur.casual,
                        appropriated: editedSlur.appropriated,
                        appropriationContext: editedSlur.appropriationContext,
                        labelMeaning: editedSlur.labelMeaning,
                        categories: editedSlur.categories.map(
                            (category) => category.category
                        )
                    });
                } else {
                    console.error('Slur not found');
                }
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

    const handleSubmit = async () => {
        try {
            const categories = formData.categories.map((category) => ({
                category
            }));
            const requestData = {
                ...formData,
                categories
            };

            await updateSlurAndCategory(user.accessToken, id, requestData);
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
                onSubmit={() => handleSubmit()}
            >
                <FormField name="label" label={'Label'} required>
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
                    required
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

                <FormField name="casual" label={'Casual'} required={false}>
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
                    label={'Appropriated'}
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
