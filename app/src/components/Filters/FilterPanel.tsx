import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

export function FilterPanel() {
  const [dateRange, setDateRange] = useState<number[]>([0, 100]);

  return (
    <div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Icon as={FiCalendar} style={{ marginRight: 6 }} />
          <Text fontWeight="bold">Time Range</Text>
        </div>

        <div style={{ display: 'flex' }}>
          <Text style={{ marginRight: 16 }} fontSize="sm">
            1/4/2019
          </Text>
          <RangeSlider
            min={0}
            max={100}
            onChangeEnd={(val) => {
              setDateRange(val);
            }}
          >
            <RangeSliderTrack bg="purple.400" />
            <RangeSliderThumb index={0}>
              <Box color="blue.400" as={ChevronLeftIcon} />
            </RangeSliderThumb>
            <RangeSliderThumb index={1}>
              <Box color="blue.400" as={ChevronRightIcon} />
            </RangeSliderThumb>
          </RangeSlider>
          <Text style={{ marginLeft: 16 }} fontSize="sm">
            12/21/2021
          </Text>
        </div>
      </div>
      <div style={{ marginTop: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Icon as={FiUser} style={{ marginRight: 6 }} />
          <Text fontWeight="bold">Contact</Text>
        </div>
        {/* Maybe this should be a multi select eventually that you can type into... */}
        <Select size="sm">
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
          <option value="abc">Option 1</option>
        </Select>
      </div>
      <div
        style={{ marginTop: 25, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button variant="link" size="sm">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
