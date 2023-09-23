import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Form,
    FormField,
    Heading,
    RadioButtonGroup,
    CheckBox,
    TextArea,
    TextInput,
    Anchor
} from 'grommet';
import { useNavigate, useParams } from 'react-router-dom';
import Api from './Api';
import { UserContext } from '../atoms/AppContext';

const { getSlurAndCategory, updateSlurAndCategory } = Api;

const categoryOptions = ['gender', 'religion', 'caste'];
const appropriatedOptions = [true, false];

export function SlurEdit() {
    const { user } = useContext(UserContext);
    // const { notification, showNotification } = useContext(NotificationContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        label: '',
        labelMeaning: '',
        categories: [],
        appropriated: false,
        appropriationContext: ''
    });
    const [, setSlurData] = useState(null);

    useEffect(() => {
        async function fetchSlurData() {
            try {
                const data = await getSlurAndCategory(user.accessToken);
                setSlurData(data);
                const editedSlur = data.find((slur) => slur.id === id);

                if (editedSlur) {
                    setFormData({
                        label: editedSlur.label,
                        labelMeaning: editedSlur.labelMeaning,
                        categories: editedSlur.categories.map(
                            (category) => category.category
                        ),
                        appropriated: editedSlur.appropriated,
                        appropriationContext: editedSlur.appropriationContext
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
        } catch (error) {
            console.error('Error updating slur:', error);
        }
    };
    const handleCategoryChange = (category) => {
        const updatedCategories = formData.categories.includes(category)
            ? formData.categories.filter((c) => c !== category)
            : [...formData.categories, category];
        setFormData({
            ...formData,
            categories: updatedCategories
        });
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

                <FormField name="labelMeaning" label="Label Meaning" required>
                    <TextArea
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

                <FormField name="categories" label="Categories" required>
                    <Box direction="row" margin="small">
                        {categoryOptions.map((category) => (
                            <CheckBox
                                key={category}
                                label={category}
                                name="categories"
                                checked={formData.categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                        ))}
                    </Box>
                </FormField>

                <FormField name="appropriated" label="Appropriated" required>
                    <RadioButtonGroup
                        name="appropriated"
                        options={appropriatedOptions}
                        direction="row"
                        value={formData.appropriated}
                    />
                </FormField>

                <FormField
                    name="appropriationContext"
                    label="Appropriation Context"
                    required
                >
                    <TextInput
                        name="appropriationContext"
                        value={formData.appropriationContext}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                appropriationContext: e.target.value
                            })
                        }
                    />
                </FormField>

                <Box direction="row" gap="medium">
                    <Button type="submit" primary label="Save" />
                </Box>
            </Form>
        </Box>
    );
}

export default SlurEdit;
