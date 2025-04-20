import { pb } from "./pb"
import { BabypredictionResponse } from "./pocketbase-types"


export const getPredictionsByTagQuery = (props: { tag: string }) => ({
  queryKey: ['babypredictions', 'get-all-by-tag', props.tag],
  queryFn() {
    const filter = props.tag === 'PARENTS' ? '' : `tag='${props.tag}' || tag='PARENTS'`
    return pb
      .collection("babypredictions")
      .getFullList<BabypredictionResponse>({ filter, sort: 'name' })
  }
})
