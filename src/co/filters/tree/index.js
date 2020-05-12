import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as filtersActions from '~data/actions/filters'
import * as configActions from '~data/actions/config'
import { makeFlatFilters } from '~data/selectors/filters'

import Section from '../section'
import Tag from '../tag'
import Type from '../type'

class FiltersTree extends React.Component {
    static defaultProps = {
        uriPrefix:          '',
        activeId:           ''
    }

    componentDidMount() {
        this.props.actions.load(0)
    }

    rowRenderer = ({ index })=>{
        const row = this.props.data[index]||{}
        let uri=''

        let Component
        switch(row.type) {
            case 'section': Component = Section; break

            case 'tag': 
                Component = Tag
                uri = '#'+row.name
            break

            case 'type':
                Component = Type;
                uri = '~'+row.name
            break

            default: return false
        }

        const { data, activeId, uriPrefix, ...etc } = this.props

        return (
            <Component 
                {...etc}
                {...row}
                to={`${uriPrefix}0/${encodeURIComponent(uri)}`}
                active={uri == decodeURIComponent(activeId)} />
        )
    }

    render() {
        return this.props.children({
            count: this.props.data.length,
            rowRenderer: this.rowRenderer
        })
    }
}

export default connect(
	() => {
        const getFilters = makeFlatFilters()
    
        return (state)=>{    
            return {
                data: getFilters(state, 0),
            }
        }
    },
	(dispatch)=>({
		actions: {
            ...bindActionCreators(filtersActions, dispatch),
            ...bindActionCreators(configActions, dispatch)
        }
    }),
    undefined,
    { forwardRef: true }
)(FiltersTree)