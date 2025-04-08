<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        // You can pass data to the constructor if needed
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail']; // This means the notification will be sent via email
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Verify Your Email Address') // Email subject
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email Address', $this->verificationUrl($notifiable)) // Verification URL
                    ->line('If you did not create an account, no further action is required.')
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the verification URL for the notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify', // This must match the route name defined in your routes
            now()->addMinutes(60), // Link expiration time
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())] // Passing user id and email hash for verification
        );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            // You can return custom data here if needed
        ];
    }
}
