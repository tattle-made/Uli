import { useState, useContext } from 'react';
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
import { useNavigate } from 'react-router-dom';
import Api from './Api';
import { UserContext } from '../atoms/AppContext';

const { createSlurAndCategory } = Api;

const categoryOptions = ['gender', 'religion', 'caste'];
const appropriatedOptions = [true, false];

export function SlurCreate() {
    const { user } = useContext(UserContext);
    console.log('user id', user.id);
    // console.log("user token", user.accessToken)
    // const { notification, showNotification } = useContext(NotificationContext);
    const initialFormData = {
        label: '',
        labelMeaning: '',
        categories: [],
        appropriated: false,
        appropriationContext: ''
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
            console.log(requestData);
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
                Add Slur
            </Heading>
            <Form
                value={formData}
                onChange={(nextValue) => setFormData(nextValue)}
                onSubmit={({ value }) => {
                    handleSubmit(value);
                }}
            >
                <FormField name="label" label="Label" required>
                    <TextInput
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

                <FormField
                    name="appropriated"
                    label="Appropriated"
                    required={false}
                >
                    <RadioButtonGroup
                        name="appropriated"
                        options={appropriatedOptions}
                        direction="row"
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
                    <Button type="submit" primary label="Submit" />
                    <Button type="reset" label="Reset" onClick={handleReset} />
                </Box>
            </Form>
        </Box>
    );
}

export default SlurCreate;
