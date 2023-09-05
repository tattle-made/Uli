import { useState } from 'react';
import { Box, Button, Heading, Form, FormField, TextInput } from 'grommet';

// const genderOptions = ['a', 'b', 'c']
// const religionOptions = ['Option 1', 'Option 2', 'Option 3']
// const sexualOrientationOptions = ['Option A', 'Option B', 'Option C']

export function SlurCreate() {
    // const [formData, setFormData] = useState({
    //     label: '',
    //     labelMeaning: '',
    //     gender: '',
    //     religion: '',
    //     sexualOrientation: '',
    //     appropriated: 'false',
    //     appropriationContext: '',
    // })
    const [value, setValue] = useState(undefined);

    const handleSubmit = (value) => {
        console.log(value);
        // console.log(formData);
    };

    return (
        <Box>
            <Heading level={3} weight={'bold'}>
                Add Slur
            </Heading>
            <Form
                onSubmit={handleSubmit}
                value={value}
                onChange={(nextValue, { touched }) => {
                    console.log('Change', nextValue, touched);
                    setValue(nextValue);
                }}
            >
                <FormField name="label" label="label">
                    <TextInput
                        name="label"
                        // value={formData.label}
                        // onChange={(event) => setFormData({ ...formData, label: event.target.value })}
                        // required
                    />
                </FormField>
                <Button type="submit" primary label="Submit" />
            </Form>
        </Box>
    );
}

export default SlurCreate;
