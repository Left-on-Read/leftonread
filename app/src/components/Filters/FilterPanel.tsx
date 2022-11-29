import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Icon,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { ContactOptionsQueryResult } from 'analysis/queries/ContactOptionsQuery';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { MultiSelect } from 'react-multi-select-component';

import { DEFAULT_FILTER_LIMIT } from '../../constants';
import { GroupChatFilters } from '../../constants/filters';
import { useGlobalContext } from '../Dashboard/GlobalContext';
import { useGoldContext } from '../Premium/GoldContext';
import { UnlockPremiumButton } from '../Premium/UnlockPremiumButton';

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
  const { isPremium } = useGoldContext();
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
    <div
      style={{
        zIndex: 10,
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {/* {!isPremium && (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <UnlockPremiumButton context="Filter Panel" />
        </div>
      )} */}
      {/* <div style={{ ...(!isPremium && { filter: 'blur(2px)', opacity: 0.2 }) }}> */}
      {!isPremium && (
        <Box style={{ marginBottom: '36px' }}>
          <UnlockPremiumButton
            context="Filter Panel"
            altText="Unlock filtering and all graphs."
          />
        </Box>
      )}

      <div>
        <div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
          >
            <Icon as={FiCalendar} style={{ marginRight: 6 }} />
            <Text fontWeight="bold">Time Range</Text>
          </div>

          <div style={{ display: 'flex' }}>
            <Text style={{ marginRight: 16, width: 150 }} fontSize="sm">
              {startDate.toLocaleDateString()}
            </Text>
            <RangeSlider
              tabIndex={-1}
              min={0}
              max={100}
              defaultValue={[0, 100]}
              onChange={(val) => {
                if (!isPremium) {
                  return;
                }
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
              isDisabled={!isPremium}
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
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
          >
            <Icon as={FiUser} style={{ marginRight: 6 }} />
            <Text fontWeight="bold">Contact</Text>
          </div>
          <MultiSelect
            disabled={!isPremium}
            value={filters.contact ?? []}
            onChange={(val: ContactOptionsQueryResult[]) => {
              if (isPremium) {
                onUpdateFilters({
                  ...filters,
                  contact: val,
                });
              }
            }}
            labelledBy="Select"
            options={contacts ?? []}
            overrideStrings={{
              allItemsAreSelected: 'All contacts selected.',
            }}
          />
        </div>
        <div style={{ marginTop: 25 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
          >
            <Text fontWeight="bold" style={{ marginRight: 16 }}>
              Include Group Chats
            </Text>
            <Switch
              tabIndex={-1}
              disabled={!isPremium}
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
        </div>

        <div
          style={{ marginTop: 25, display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            disabled={!isPremium}
            tabIndex={-1}
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
    </div>
  );
}
