import { useState } from 'react';
import {
    Box,
    Button,
    Form,
    FormField,
    Heading,
    RadioButtonGroup,
    Select,
    TextArea,
    TextInput,
    Anchor
} from 'grommet';
import { useNavigate } from 'react-router-dom';

const genderOptions = ['a', 'b', 'c'];
const religionOptions = ['Option 1', 'Option 2', 'Option 3'];
const sexualOrientationOptions = ['Option A', 'Option B', 'Option C'];
const appropriatedOptions = [true, false];

export function SlurCreate() {
    const initialFormData = {
        label: '',
        labelMeaning: '',
        gender: '',
        religion: '',
        sexualOrientation: '',
        appropriated: false,
        appropriationContext: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/slur');
    };

    const handleSubmit = (value) => {
        console.log(value);
        console.log(formData);
    };
    const handleReset = () => {
        setFormData(initialFormData);
    };

    return (
        <Box>
            <Anchor onClick={handleGoBack}>Go Back</Anchor>
            <Heading level={3} weight={'bold'} alignSelf="center">
                Add Slur
            </Heading>
            <Form
                value={formData}
                onChange={(nextValue) => setFormData(nextValue)}
                onSubmit={handleSubmit}
            >
                <FormField name="label" label="Label" required>
                    <TextInput name="label" />
                </FormField>

                <FormField name="labelMeaning" label="Label Meaning" required>
                    <TextArea name="labelMeaning" />
                </FormField>

                <FormField name="gender" label="Gender" required>
                    <RadioButtonGroup name="gender" options={genderOptions} />
                </FormField>

                <FormField name="religion" label="Religion" required>
                    <Select name="religion" options={religionOptions} />
                </FormField>

                <FormField
                    name="sexualOrientation"
                    label="Sexual Orientation"
                    required
                >
                    <Select
                        name="sexualOrientation"
                        options={sexualOrientationOptions}
                    />
                </FormField>

                <FormField name="appropriated" label="Appropriated" required>
                    <RadioButtonGroup
                        name="appropriated"
                        options={appropriatedOptions}
                        defaultValue={false}
                    />
                </FormField>

                <FormField
                    name="appropriationContext"
                    label="Appropriation Context"
                    required
                >
                    <TextInput name="appropriationContext" />
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
