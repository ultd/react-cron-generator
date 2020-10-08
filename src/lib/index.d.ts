import * as React from 'react'

export enum HEADER {
    MINUTES = 'MINUTES',
    HOURLY = 'HOURLY',
    DAILY ='DAILY',
    WEEKLY ='WEEKLY',
    MONTHLY ='MONTHLY'
}

export interface CronProps {
    value?: string
    onChange: (e: string) => void
    showResultText?: boolean
    showResultCron?: boolean
    translateFn?: (key: string) => string
    locale?: string
    options?: { headers?: HEADER[] }
    containerClassName?: React.CSSProperties
    headerItemClassName?: React.CSSProperties
    headerItemSelectedClassName?: React.CSSProperties
    headersContainerClassName?: React.CSSProperties
	cronViewClassName?: React.CSSProperties
	resultTextCronName?: React.CSSProperties
} 
declare class Cron extends React.Component<CronProps, any> {}

export default Cron;
