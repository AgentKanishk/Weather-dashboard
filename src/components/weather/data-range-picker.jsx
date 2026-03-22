import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { CalendarIcon, ArrowRight } from 'lucide-react'

export function DateRangePicker({ onRangeChange, maxDays = 730 }) {
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days').toDate())
  const [endDate, setEndDate] = useState(dayjs().toDate())
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)

  const handleStartDateChange = (date) => {
    if (!date) return
    const daysDiff = dayjs(endDate).diff(dayjs(date), 'day')
    if (daysDiff > maxDays) {
      const newEndDate = dayjs(date).add(maxDays, 'days').toDate()
      setEndDate(newEndDate)
      setStartDate(date)
      onRangeChange(dayjs(date).format('YYYY-MM-DD'), dayjs(newEndDate).format('YYYY-MM-DD'))
    } else {
      setStartDate(date)
      onRangeChange(dayjs(date).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD'))
    }
    setOpenStart(false)
  }

  const handleEndDateChange = (date) => {
    if (!date) return
    const daysDiff = dayjs(date).diff(dayjs(startDate), 'day')
    if (daysDiff > maxDays) {
      const newStartDate = dayjs(date).subtract(maxDays, 'days').toDate()
      setStartDate(newStartDate)
      setEndDate(date)
      onRangeChange(dayjs(newStartDate).format('YYYY-MM-DD'), dayjs(date).format('YYYY-MM-DD'))
    } else {
      setEndDate(date)
      onRangeChange(dayjs(startDate).format('YYYY-MM-DD'), dayjs(date).format('YYYY-MM-DD'))
    }
    setOpenEnd(false)
  }

  const daysDiff = dayjs(endDate).diff(dayjs(startDate), 'day')

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="px-5 py-4 border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Date Range
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl font-medium">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                {dayjs(startDate).format('MMM DD, YYYY')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={(date) =>
                  date > endDate || dayjs(date).isBefore(dayjs().subtract(2, 'years'))
                }
              />
            </PopoverContent>
          </Popover>

          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl font-medium">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                {dayjs(endDate).format('MMM DD, YYYY')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={(date) => date < startDate || date > dayjs().toDate()}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full ml-auto font-medium">
            {daysDiff} days selected
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
