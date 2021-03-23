/* Lib */
import Axios from 'axios'
import cx from 'classnames'
import { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios, { AxiosResponse } from 'axios'

const Index = (): any => {
  const { register, handleSubmit, errors } = useForm()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (data: any) => fetchSearch(data.query)

  const fetchSearch = async (q: string) => {
    const body: object = {
      query: q
    }
    setResult(null) // reset result
    setLoading(true) // set loading true
    await axios.post('/api/search', body).then((res) => {
      console.log(res)
      setResult(res.data)
      setLoading(false) // set loading false when result retrieved
    })
  }

  return (
    <>
      <Container className={cx(['mt-5'])}>
        <form className="form-inline" onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <div className="form-group mx-sm-2 mb-2">
            <input
              className="form-control"
              name="query"
              ref={register({ required: true })}
            />
          </div>
          <input className="btn btn-primary mb-2" type="submit" />
        </form>
        <table className="table mt-5">
          <thead>
            <tr className="text-muted">
              <th scope="col-md-*" style={{ width: '50%' }}>
                Link
              </th>
              <th scope="col">Score</th>
              <th scope="col">Content</th>
              <th scope="col">Location</th>
              <th scope="col">Distance</th>
              <th scope="col">PageRank</th>
            </tr>
          </thead>
          <tbody>
            {result &&
              result.map((r) => {
                return (
                  <tr>
                    <td>{r.link}</td>
                    <td>{r.score}</td>
                    <td>{r.content}</td>
                    <td>{r.location}</td>
                    <td>{r.distance}</td>
                    <td>{r.pagerank}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {loading && (
          <div>
            <Spinner
              className="d-block m-auto"
              animation="border"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
      </Container>
    </>
  )
}

export default Index
