import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
} from '@chakra-ui/react';

interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

interface PromptFormProps {
  initialData?: PromptFormData;
  onSubmit: (data: PromptFormData) => Promise<void>;
  isEditing?: boolean;
}

const CATEGORIES = [
  'AI',
  'Writing',
  'Programming',
  'Business',
  'Education',
  'Other',
];

export const PromptForm: React.FC<PromptFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PromptFormData>({
    defaultValues: initialData,
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setTags(initialData.tags);
    }
  }, [initialData, reset]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tags.includes(tagInput.trim())) {
        toast({
          title: 'Tag already exists',
          status: 'warning',
          duration: 2000,
        });
        return;
      }
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onFormSubmit = async (data: PromptFormData) => {
    try {
      const formData = {
        ...data,
        tags,
      };
      await onSubmit(formData);
      toast({
        title: `Prompt ${isEditing ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
      if (!isEditing) {
        reset();
        setTags([]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save prompt',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onFormSubmit)} p={4}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>Title</FormLabel>
          <Input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Minimum length should be 3' },
            })}
            placeholder="Enter prompt title"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.content}>
          <FormLabel>Content</FormLabel>
          <Textarea
            {...register('content', {
              required: 'Content is required',
              minLength: { value: 10, message: 'Minimum length should be 10' },
            })}
            placeholder="Enter your prompt content"
            rows={6}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select {...register('category', { required: true })}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Tags</FormLabel>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type and press Enter to add tags"
          />
          <Box mt={2}>
            {tags.map((tag) => (
              <Tag
                key={tag}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                m={1}
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
              </Tag>
            ))}
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Visibility</FormLabel>
          <Select {...register('isPublic')}>
            <option value="true">Public</option>
            <option value="false">Private</option>
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
        >
          {isEditing ? 'Update Prompt' : 'Create Prompt'}
        </Button>
      </Stack>
    </Box>
  );
};

export default PromptForm;