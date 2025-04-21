import { UseQueryOptions } from "@tanstack/react-query"
import { pb } from "./pb"
import { BabypredictionsResponse } from "./pocketbase-types"


export const getPredictionsByTagQuery = (props: { tag: string }): UseQueryOptions<BabypredictionsResponse[]> => ({
  queryKey: ['babypredictions', 'get-all-by-tag', props.tag],
  queryFn() {
    const filter = props.tag === 'PARENTS' ? '' : `tag='${props.tag}' || tag='PARENTS'`
    return pb
      .collection("babypredictions")
      .getFullList<BabypredictionsResponse>({ filter, sort: 'genero' })
  }
})
