import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Switch,
  Text,
} from '@chakra-ui/react';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { DEFAULT_FILTER_LIMIT } from '../../constants';
import { GroupChatFilters } from '../../constants/filters';
import { useGlobalContext } from '../Dashboard/GlobalContext';

export const DEFAULT_QUERY_FILTERS = {
  limit: DEFAULT_FILTER_LIMIT,
  groupChat: GroupChatFilters.ONLY_INDIVIDUAL,
};

export function FilterPanel({
  filters,
  onUpdateFilters,
}: {
  filters: SharedQueryFilters;
  onUpdateFilters: (arg0: SharedQueryFilters) => void;
}) {
  const { dateRange, contacts } = useGlobalContext();
  const [filterDateRange, setFilterDateRange] = useState<number[]>([0, 100]);

  const difference =
    dateRange.latestDate.getTime() - dateRange.earliestDate.getTime();
  const startDate = new Date(
    (filterDateRange[0] / 100) * difference + dateRange.earliestDate.getTime()
  );
  const endDate = new Date(
    (filterDateRange[1] / 100) * difference + dateRange.earliestDate.getTime()
  );

  return (
    <div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Icon as={FiCalendar} style={{ marginRight: 6 }} />
          <Text fontWeight="bold">Time Range</Text>
        </div>

        <div style={{ display: 'flex' }}>
          <Text style={{ marginRight: 16, width: 150 }} fontSize="sm">
            {startDate.toLocaleDateString()}
          </Text>
          <RangeSlider
            min={0}
            max={100}
            defaultValue={[0, 100]}
            onChange={(val) => {
              setFilterDateRange(val);
            }}
            onChangeEnd={(val) => {
              const diff =
                dateRange.latestDate.getTime() -
                dateRange.earliestDate.getTime();
              const filterStart = new Date(
                (val[0] / 100) * diff + dateRange.earliestDate.getTime()
              );
              const filterEnd = new Date(
                (val[1] / 100) * diff + dateRange.earliestDate.getTime()
              );
              onUpdateFilters({
                ...filters,
                timeRange: {
                  startDate: filterStart,
                  endDate: filterEnd,
                },
              });
            }}
            value={filterDateRange}
          >
            <RangeSliderTrack bg="purple.400" />
            <RangeSliderThumb index={0}>
              <Box color="blue.400" as={ChevronLeftIcon} />
            </RangeSliderThumb>
            <RangeSliderThumb index={1}>
              <Box color="blue.400" as={ChevronRightIcon} />
            </RangeSliderThumb>
          </RangeSlider>
          <Text style={{ marginLeft: 16, width: 150 }} fontSize="sm">
            {endDate.toLocaleDateString()}
          </Text>
        </div>
      </div>
      <div style={{ marginTop: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Icon as={FiUser} style={{ marginRight: 6 }} />
          <Text fontWeight="bold">Contact</Text>
        </div>
        {/* Maybe this should be a multi select eventually that you can type into... */}
        <Select
          size="sm"
          onChange={(e) => {
            if (e.target.value === 'none_selected') {
              onUpdateFilters({
                ...filters,
                contact: undefined,
              });
            } else {
              onUpdateFilters({
                ...filters,
                contact: e.target.value,
              });
            }
          }}
          value={
            filters.contact === undefined ? 'none_selected' : filters.contact
          }
        >
          <option key="none" value="none_selected">
            None
          </option>
          {contacts.map((contact) => (
            <option key={contact.value} value={contact.value}>
              {contact.label}
            </option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Text fontWeight="bold" style={{ marginRight: 16 }}>
            Include Group Chats
          </Text>
          <Switch
            colorScheme="purple"
            isChecked={filters.groupChat === GroupChatFilters.BOTH}
            onChange={(e) => {
              onUpdateFilters({
                ...filters,
                groupChat: e.target.checked
                  ? GroupChatFilters.BOTH
                  : GroupChatFilters.ONLY_INDIVIDUAL,
              });
            }}
          />
        </div>
        {/* Maybe this should be a multi select eventually that you can type into... */}
      </div>
      <div
        style={{ marginTop: 25, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            onUpdateFilters(DEFAULT_QUERY_FILTERS);
            setFilterDateRange([0, 100]);
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
