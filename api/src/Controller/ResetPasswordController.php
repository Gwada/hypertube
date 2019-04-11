<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;

class ResetPasswordController extends AbstractController
{

    /**
     * @var string
     */
    private $newPassword;

    /**
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @param ObjectManager $manager
     * @return JsonResponse
     */
    public function __invoke(Request $request, UserPasswordEncoderInterface $encoder, ObjectManager $manager)
    {

        $requestContent = json_decode($request->getContent());
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $entityManager->getRepository(User::class);

        /**
         * Verification of the new password
         */
        if (isset($requestContent->new_password)) {
            if (!$this->setNewPassword($requestContent->new_password)) {
                return new JsonResponse(['message' => 'New password is invalid'], 403);
            }
        } else {
            return new JsonResponse(['message' => 'New password is missing'], 403);
        }
        $user->setPassword($encoder->encodePassword($user, $this->newPassword));
        $manager->flush();
        return new JsonResponse(['message' => 'Successfully changed password'], 200);

        /**
         * Verification of token
         */
       
    }

    /**
     * Verification of the new password validity
     *
     * @param string $newPassword
     * @return boolean
     */
    private function setNewPassword(string $newPassword): bool
    {
        if (preg_match('/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/', $newPassword)) {
            $this->newPassword = $newPassword;
            return true;
        }
        return false;
    }
}