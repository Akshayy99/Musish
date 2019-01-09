import React from 'react';
import PropTypes from 'prop-types';
import Player from '../../Player/Player';
import classes from './Sidebar.scss';
import PlaylistMenuItem from './PlaylistMenuItem';
import withMK from '../../../../hoc/withMK';
import SidebarMenu from './SidebarMenu';
import SidebarLibraryMenu from './SidebarLibraryMenu';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlists = this.props.mk.instance.isAuthorized
      ? await music.api.library.playlists()
      : null;

    this.setState({
      playlists,
    });
  }

  render() {
    const authorized = this.props.mk.instance.isAuthorized;

    const playlists =
      authorized &&
      this.state.playlists &&
      this.state.playlists.map(playlist => (
        <PlaylistMenuItem
          playlist={playlist}
          to={`/playlists/${playlist.id}`}
          label={playlist.attributes.name}
          key={playlist.id}
        />
      ));
    const appleMusic = authorized ? (
      <SidebarMenu
        title={'Apple music'}
        items={[
          { to: '/', label: 'For You' },
          { to: '/browse', label: 'Browse' },
          { to: '/radio', label: 'Radio' },
        ]}
      />
    ) : (
      <SidebarMenu
        title={'Apple music'}
        items={[{ to: '/browse', label: 'Browse' }, { to: '/radio', label: 'Radio' }]}
      />
    );

    return (
      <aside className={classes.sidebar}>
        <div className={classes.menus}>
          {appleMusic}
          {authorized && (
            <SidebarLibraryMenu
              title={'My Library'}
              items={[
                { to: '/artists', label: 'Artists' },
                { to: '/albums', label: 'Albums' },
                { to: '/songs', label: 'Songs' },
                { to: '/playlists', label: 'Playlists' },
              ]}
            />
          )}
          {playlists && (
            <div className={classes.menu}>
              <h3>Playlists</h3>
              <ul>{playlists}</ul>
            </div>
          )}
        </div>
        <Player />
      </aside>
    );
  }
}

Sidebar.propTypes = {
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.authorizationStatusDidChange]: 'authorization',
};

export default withMK(Sidebar, bindings);
