import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
} from '@chakra-ui/react';

interface FilterOptionsProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  tags: string[];
  rating: number[];
  sortBy: string;
  showVerifiedOnly: boolean;
}

const categories = [
  'All',
  'Writing',
  'Programming',
  'Art',
  'Business',
  'Education',
  'Other',
];

const tags = [
  'GPT-3',
  'GPT-4',
  'DALL-E',
  'Midjourney',
  'Coding',
  'Creative',
  'Technical',
];

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    tags: [],
    rating: [0, 5],
    sortBy: 'newest',
    showVerifiedOnly: false,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleTagToggle = (tag: string) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange({ tags: updatedTags });
  };

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="sm">
      <Stack spacing={4}>
        {/* Category Filter */}
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Tags Filter */}
        <FormControl>
          <FormLabel>Tags</FormLabel>
          <Stack direction="row" flexWrap="wrap" spacing={2}>
            {tags.map((tag) => (
              <Checkbox
                key={tag}
                isChecked={filters.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              >
                {tag}
              </Checkbox>
            ))}
          </Stack>
        </FormControl>

        {/* Rating Range Filter */}
        <FormControl>
          <FormLabel>Rating Range</FormLabel>
          <RangeSlider
            min={0}
            max={5}
            step={0.5}
            value={filters.rating}
            onChange={(value) => handleFilterChange({ rating: value })}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text fontSize="sm" color="gray.600">
            {filters.rating[0]} - {filters.rating[1]} stars
          </Text>
        </FormControl>

        {/* Sort Options */}
        <FormControl>
          <FormLabel>Sort By</FormLabel>
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </Select>
        </FormControl>

        {/* Verified Content Filter */}
        <Checkbox
          isChecked={filters.showVerifiedOnly}
          onChange={(e) => handleFilterChange({ showVerifiedOnly: e.target.checked })}
        >
          Show Verified Content Only
        </Checkbox>
      </Stack>
    </Box>
  );
};

export default FilterOptions;
<FilterOptions onFilterChange={(filters) => {
  // フィルターの変更を処理
  console.log(filters);
  // APIリクエストを送信するなど
}} />