
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Check, PlusCircle } from 'lucide-react';
import { Separator } from './separator';
import { Badge } from './badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './command';

interface Props {
  column: any,
  title: string,
}

export function Filter({ column, title }: Props) {

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue())

  const options = [...facets.keys()].map(item => ({ value: item, label: item }))


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-slate-200 min-w-fit">
          <PlusCircle className="mr-2 h-4 w-4 text-slate-500" />
          <span className='text-slate-500'>
            {title}
          </span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="px-1 font-normal lg:hidden bg-slate-100 rounded-md"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal bg-slate-100 rounded-md"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option: any) => selectedValues.has(option.value))
                    .map((option: any) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="px-1 bg-slate-100 rounded-md"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option: any) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues)
                      console.log(filterValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <Button
                    variant="ghost"
                    onClick={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center w-full py-1"
                  >
                    Clear filters
                  </Button>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
