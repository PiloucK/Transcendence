import styles from "../Inputs/ProfileSettingsDialog.module.css";

export function ButtonUpdateProfileSettings({
	updateChannel,
}: {
	updateChannel: () => void;
}) {
	return (
		<div
			className={styles.channel_settings_update}
			onClick={updateChannel}
		>
			Update username and profile picture
		</div>
	);
}
